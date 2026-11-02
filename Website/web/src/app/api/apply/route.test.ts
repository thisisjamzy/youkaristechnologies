// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const PDF = new TextEncoder().encode("%PDF-1.7\n% a tiny test CV\n");

const fields: Record<string, string> = {
  roleId: "logistics-officer",
  fullName: "Mary Ndi",
  baptismName: "Mary",
  phone: "+237 6 70 00 00 00",
  email: "mary@example.org",
  parish: "St Anthony",
  city: "Buea, Cameroon",
  q1: "Answer one",
  q2: "Answer two",
  q3: "Answer three",
  links: "",
  hours: "4 to 6 hours",
  confirmUnpaid: "on",
  confirmSunday: "on",
  confirmRosary: "on",
  joinAsStranger: "on",
};

let ip = 0;

/** A multipart request whose body is plain bytes, as it arrives from a browser. */
async function application(
  overrides: Record<string, string | null> = {},
  cv: File | null = new File([PDF], "mary-cv.pdf", { type: "application/pdf" }),
  address = `10.1.0.${++ip}`,
) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ...fields, ...overrides })) if (v !== null) form.set(k, v);
  if (cv) form.set("cv", cv);
  const encoded = new Response(form);
  return new Request("http://localhost/api/apply", {
    method: "POST",
    headers: { "content-type": encoded.headers.get("content-type") ?? "", "x-forwarded-for": address },
    body: new Uint8Array(await encoded.arrayBuffer()),
  });
}

async function send(request: Promise<Request>) {
  const res = await POST(await request);
  return { status: res.status, json: await res.json() };
}

const backend = (body: unknown) => {
  const fetchMock = vi.fn().mockImplementation(async () => Response.json(body));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

beforeEach(() => {
  vi.stubEnv("APPS_SCRIPT_URL", "https://script.example/exec");
  vi.stubEnv("APPS_SCRIPT_SECRET", "s3cret");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/apply", () => {
  it("forwards a valid application with a PDF, the server's questions and the CV in base64", async () => {
    const fetchMock = backend({ ok: true, applicationId: "VOL-1" });
    const { status, json } = await send(application({ q1: "Answer one", roleId: "logistics-officer" }));
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toMatchObject({
      secret: "s3cret",
      action: "apply",
      sourcePage: "roles",
      roleId: "logistics-officer",
      answers: { q1: "Answer one", q2: "Answer two", q3: "Answer three" },
      confirmUnpaid: true,
      joinAsStranger: true,
      cv: { fileName: "mary-cv.pdf", mimeType: "application/pdf" },
    });
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    expect(sent.questions).toHaveLength(3);
    expect(sent.questions[0]).toBe("Why are you ideal for this role?");
    expect(Buffer.from(sent.cv.base64, "base64").toString()).toBe(new TextDecoder().decode(PDF));
  });

  it("ignores question text sent by the browser", async () => {
    const fetchMock = backend({ ok: true });
    await send(application({ questions: "Tell us your bank details" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).questions).not.toContain("Tell us your bank details");
  });

  it("rejects a text file renamed to .pdf, without calling the backend", async () => {
    const fetchMock = backend({ ok: true });
    const renamed = new File(["Dear team, this is my CV."], "cv.pdf", { type: "application/pdf" });
    const { status, json } = await send(application({}, renamed));
    expect(status).toBe(400);
    expect(json).toEqual({ ok: false, error: "validation", fields: { cv: "invalid_type" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a 5 MB file before reading it all", async () => {
    const fetchMock = backend({ ok: true });
    const big = new File([PDF, new Uint8Array(5 * 1024 * 1024)], "cv.pdf", { type: "application/pdf" });
    const { status, json } = await send(application({}, big));
    expect(status).toBe(400);
    expect(json.fields).toEqual({ cv: "too_large" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing confirmation", async () => {
    const fetchMock = backend({ ok: true });
    const { status, json } = await send(application({ confirmUnpaid: null }));
    expect(status).toBe(400);
    expect(json.fields).toEqual({ confirmUnpaid: "required" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects the appointed Core and Content Lead", async () => {
    backend({ ok: true });
    const { json } = await send(application({ roleId: "core-and-content-lead-and-network-chaplain" }));
    expect(json.fields).toEqual({ roleId: "invalid" });
  });

  it("passes the backend's validation fields through", async () => {
    backend({ ok: false, error: "validation", fields: { phone: "invalid", sheet: "x" } });
    const { status, json } = await send(application());
    expect(status).toBe(400);
    expect(json).toEqual({ ok: false, error: "validation", fields: { phone: "invalid" } });
  });

  it.each(["applications_closed", "role_closed"])("passes %s through", async (error) => {
    backend({ ok: false, error });
    const { status, json } = await send(application());
    expect(status).toBe(409);
    expect(json).toEqual({ ok: false, error });
  });

  it("hides other backend errors and never logs the secret or the file", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    backend({ ok: false, error: "unauthorised" });
    const { status, json } = await send(application());
    expect(status).toBe(502);
    expect(json).toEqual({ ok: false, error: "server" });
    const logged = JSON.stringify(log.mock.calls);
    expect(logged).not.toContain("s3cret");
    expect(logged).not.toContain(Buffer.from(PDF).toString("base64"));
  });

  it("allows five applications a minute from one address, then 429", async () => {
    backend({ ok: true });
    const same = () => application({}, undefined, "203.0.113.7");
    for (let i = 0; i < 5; i++) expect((await send(same())).status).toBe(200);
    expect((await send(same())).json).toEqual({ ok: false, error: "rate_limited" });
  });
});
