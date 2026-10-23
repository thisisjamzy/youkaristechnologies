import { beforeEach, describe, expect, it, vi } from "vitest";

const appsScriptPost = vi.fn();
const revalidateTag = vi.fn();
vi.mock("@/shared/lib/appsScript", () => ({ appsScriptPost: (p: unknown) => appsScriptPost(p) }));
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
  cacheLife: () => {},
  cacheTag: () => {},
}));

const valid = {
  sourcePage: "home",
  fullName: "Mary Ndi",
  baptismName: "Mary",
  email: "mary@example.org",
  parish: "St Anthony",
  city: "Buea, Cameroon",
  joinAsStranger: true,
  applyCoreTeam: false,
};

let ip = 0;
// A fresh IP per request, so the rate limit only bites in its own test.
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/signup", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function post(body: unknown, headers?: Record<string, string>) {
  const { POST } = await import("./route");
  const res = await POST(request(body, headers));
  return { status: res.status, json: await res.json() };
}

beforeEach(() => {
  appsScriptPost.mockReset();
  revalidateTag.mockReset();
});

describe("POST /api/signup", () => {
  it("rejects invalid fields with codes, without calling the backend", async () => {
    const { status, json } = await post({ ...valid, email: "nope", fullName: "" });
    expect(status).toBe(400);
    expect(json).toEqual({ ok: false, error: "validation", fields: { email: "invalid", fullName: "required" } });
    expect(appsScriptPost).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    expect((await post("{not json")).status).toBe(400);
  });

  it("pretends success for the honeypot and forwards nothing", async () => {
    const { status, json } = await post({ ...valid, website: "spam.example" });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(appsScriptPost).not.toHaveBeenCalled();
  });

  it("forwards the backend payload and reports places left", async () => {
    appsScriptPost.mockResolvedValue({ ok: true, strangerId: "STR-1", applicationId: null, placesLeft: 17 });
    const { status, json } = await post(valid);
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, placesLeft: 17, coreTeamFull: false });
    const payload = appsScriptPost.mock.calls[0][0];
    expect(payload).toMatchObject({ action: "signup", sourcePage: "home", whatsapp: "", teams: [] });
    expect(typeof payload.submittedAt).toBe("string");
    expect(payload).not.toHaveProperty("secret"); // the client adds it, server-side
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("sends team names with an application and refreshes the places", async () => {
    appsScriptPost.mockResolvedValue({ ok: true, strangerId: "STR-1", applicationId: "APP-1", placesLeft: 16 });
    await post({ ...valid, applyCoreTeam: true, teams: ["outreach", "technology"], about: "Hi" });
    expect(appsScriptPost.mock.calls[0][0].teams).toEqual(["Outreach", "Technology"]);
    expect(revalidateTag).toHaveBeenCalledWith("core-team-places", "max");
  });

  it("treats a full core team as success: the stranger is saved", async () => {
    appsScriptPost.mockResolvedValue({ ok: false, error: "core_team_full", strangerId: "STR-1", placesLeft: 0 });
    const { status, json } = await post({ ...valid, applyCoreTeam: true });
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true, placesLeft: 0, coreTeamFull: true });
  });

  it("maps backend validation fields to ours", async () => {
    appsScriptPost.mockResolvedValue({ ok: false, error: "validation", fields: { whatsapp: "invalid", body: "x" } });
    const { status, json } = await post(valid);
    expect(status).toBe(400);
    expect(json.fields).toEqual({ whatsApp: "invalid" });
  });

  it.each(["server", "unauthorised", "unknown_action"])("hides a backend %s error behind one friendly answer", async (error) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    appsScriptPost.mockResolvedValue({ ok: false, error });
    const { status, json } = await post(valid);
    expect(status).toBe(502);
    expect(json).toEqual({ ok: false, error: "server" });
  });

  it("allows five requests a minute from one address, then 429", async () => {
    appsScriptPost.mockResolvedValue({ ok: true, placesLeft: 17 });
    const same = { "x-forwarded-for": "203.0.113.9" };
    for (let i = 0; i < 5; i++) expect((await post(valid, same)).status).toBe(200);
    const { status, json } = await post(valid, same);
    expect(status).toBe(429);
    expect(json).toEqual({ ok: false, error: "rate_limited" });
  });
});
