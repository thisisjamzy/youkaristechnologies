import { afterEach, describe, expect, it, vi } from "vitest";
import { appsScriptGet, appsScriptPost } from "./appsScript";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const configure = () => {
  vi.stubEnv("APPS_SCRIPT_URL", "https://script.google.com/macros/s/TEST/exec");
  vi.stubEnv("APPS_SCRIPT_SECRET", "s3cret");
};

describe("appsScript client", () => {
  it("adds the secret, follows redirects and times out", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true, strangerId: "STR-1" }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await appsScriptPost({ action: "signup" })).toEqual({ ok: true, strangerId: "STR-1" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://script.google.com/macros/s/TEST/exec");
    expect(JSON.parse(init.body)).toEqual({ action: "signup", secret: "s3cret" });
    expect(init.redirect).toBe("follow");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("waits 10 seconds by default, longer when asked", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => Response.json({ ok: true })));
    const timeout = vi.spyOn(AbortSignal, "timeout");
    await appsScriptPost({ action: "signup" });
    await appsScriptPost({ action: "apply" }, { timeoutMs: 45_000 });
    expect(timeout.mock.calls).toEqual([[10_000], [45_000]]);
  });

  it("puts the action and secret in the GET query", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true, time: "now" }));
    vi.stubGlobal("fetch", fetchMock);
    await appsScriptGet("health");
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("action")).toBe("health");
    expect(url.searchParams.get("secret")).toBe("s3cret");
  });

  it("turns network failures and non-JSON replies into a server error, without logging the secret", async () => {
    configure();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("timed out", "TimeoutError")));
    expect(await appsScriptPost({})).toEqual({ ok: false, error: "server" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>Error</html>")));
    expect(await appsScriptPost({})).toEqual({ ok: false, error: "server" });
    expect(JSON.stringify(log.mock.calls)).not.toContain("s3cret");
  });

  it("uses the mock in development when not configured", async () => {
    vi.stubEnv("APPS_SCRIPT_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(await appsScriptGet("health")).toMatchObject({ ok: true });
  });

  it("reports an outage in production when not configured", async () => {
    vi.stubEnv("APPS_SCRIPT_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await appsScriptGet("health")).toEqual({ ok: false, error: "server" });
  });
});
