import { describe, expect, it } from "vitest";
import { toAppsScriptPayload } from "./payload";
import { signupSchema as schema, toFieldErrors, type SignupInput } from "./schema";

const valid: SignupInput = {
  sourcePage: "home",
  baptismName: "Mary",
  phone: "+237 6 70 00 00 00",
  parish: "St Anthony",
  city: "Buea, Cameroon",
  joinAsStranger: true,
};

const errorsFor = (input: unknown) => {
  const result = schema.safeParse(input);
  return result.success ? {} : toFieldErrors(result.error);
};

describe("signup schema", () => {
  it("accepts a sign-up without an email", () => {
    const result = schema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("");
  });

  it("normalises an email when one is given", () => {
    expect(schema.parse({ ...valid, email: "  Mary@Example.org " }).email).toBe("mary@example.org");
  });

  it("requires baptism name, phone, parish and city, and never a full name", () => {
    const blank = { ...valid, baptismName: " ", phone: "", parish: "", city: "" };
    expect(errorsFor(blank)).toEqual({ baptismName: "required", phone: "required", parish: "required", city: "required" });
    expect(Object.keys(schema.shape)).not.toContain("fullName");
  });

  it("rejects a phone number that does not look real", () => {
    expect(errorsFor({ ...valid, phone: "call me" })).toEqual({ phone: "invalid" });
    expect(errorsFor({ ...valid, phone: "12-34" })).toEqual({ phone: "invalid" });
  });

  it("checks the email only when it is filled", () => {
    expect(errorsFor({ ...valid, email: "" })).toEqual({});
    expect(errorsFor({ ...valid, email: "not-an-email" })).toEqual({ email: "invalid" });
  });

  it("enforces the backend's length limits", () => {
    expect(errorsFor({ ...valid, baptismName: "a".repeat(121), city: "b".repeat(161) })).toEqual({
      baptismName: "too_long",
      city: "too_long",
    });
  });

  it("only takes Home sign-ups that join as a stranger", () => {
    expect(schema.safeParse({ ...valid, sourcePage: "build-with-us" }).success).toBe(false);
    expect(schema.safeParse({ ...valid, joinAsStranger: false }).success).toBe(false);
  });
});

describe("toAppsScriptPayload", () => {
  it("sends exactly the fields the backend's signup action takes", () => {
    const data = schema.parse({ ...valid, email: "mary@example.org" });
    const payload = toAppsScriptPayload(data, new Date("2026-10-23T12:00:00Z"));
    expect(payload).toEqual({
      action: "signup",
      sourcePage: "home",
      baptismName: "Mary",
      phone: "+237 6 70 00 00 00",
      parish: "St Anthony",
      city: "Buea, Cameroon",
      email: "mary@example.org",
      joinAsStranger: true,
      submittedAt: "2026-10-23T12:00:00.000Z",
    });
  });
});
