import { describe, expect, it } from "vitest";
import { toAppsScriptPayload } from "./payload";
import { createSignupSchema, toFieldErrors, type SignupInput } from "./schema";

const teams = ["outreach", "technology"] as const;
const schema = createSignupSchema(teams);
const names: Record<(typeof teams)[number], string> = { outreach: "Outreach", technology: "Technology" };

const valid: SignupInput<(typeof teams)[number]> = {
  sourcePage: "home",
  fullName: "Mary Ndi",
  baptismName: "Mary",
  email: "  Mary@Example.org ",
  parish: "St Anthony",
  city: "Buea, Cameroon",
  joinAsStranger: true,
  applyCoreTeam: false,
};

const errorsFor = (input: unknown) => {
  const result = schema.safeParse(input);
  return result.success ? {} : toFieldErrors(result.error);
};

describe("signup schema", () => {
  it("accepts a valid sign-up and normalises the email", () => {
    const result = schema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("mary@example.org");
    expect(result.data?.whatsApp).toBe("");
  });

  it("requires the five fields", () => {
    const blank = { ...valid, fullName: " ", baptismName: "", email: "", parish: "", city: "" };
    expect(errorsFor(blank)).toEqual({
      fullName: "required",
      baptismName: "required",
      email: "required",
      parish: "required",
      city: "required",
    });
  });

  it("rejects a bad email and a bad WhatsApp number, but allows WhatsApp empty", () => {
    expect(errorsFor({ ...valid, email: "not-an-email", whatsApp: "call me" })).toEqual({
      email: "invalid",
      whatsApp: "invalid",
    });
    expect(errorsFor({ ...valid, whatsApp: "+237 6 70 00 00 00" })).toEqual({});
  });

  it("enforces the backend's length limits", () => {
    expect(errorsFor({ ...valid, fullName: "a".repeat(121), about: "b".repeat(2001) })).toEqual({
      fullName: "too_long",
      about: "too_long",
    });
  });

  it("needs at least one choice", () => {
    expect(errorsFor({ ...valid, joinAsStranger: false, applyCoreTeam: false })).toEqual({ choice: "required" });
  });

  it("only accepts known teams and pages", () => {
    expect(errorsFor({ ...valid, teams: ["catering"] })).toEqual({ teams: "invalid" });
    expect(schema.safeParse({ ...valid, sourcePage: "admin" }).success).toBe(false);
  });
});

describe("toAppsScriptPayload", () => {
  it("maps to the backend's names and drops teams when not applying", () => {
    const data = schema.parse({ ...valid, whatsApp: "+237 670", teams: ["outreach"], about: "Hi" });
    const payload = toAppsScriptPayload(data, (id) => names[id], new Date("2026-10-23T12:00:00Z"));
    expect(payload).toMatchObject({ action: "signup", whatsapp: "+237 670", teams: [], about: "" });
    expect(payload.submittedAt).toBe("2026-10-23T12:00:00.000Z");
  });

  it("sends team names with an application", () => {
    const data = schema.parse({ ...valid, applyCoreTeam: true, teams: ["outreach", "technology"], about: "Hi" });
    expect(toAppsScriptPayload(data, (id) => names[id], new Date()).teams).toEqual(["Outreach", "Technology"]);
  });
});
