import { describe, expect, it } from "vitest";
import { isValidEmail, isValidPhone } from "./contact";

describe("contact rules", () => {
  it.each(["+237 6 70 00 00 00", "+44 (20) 7946-0958", "2348012345678"])("accepts the phone %s", (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  it.each(["call me", "+12 34", "12-34-56", "+237 670 abc"])("rejects the phone %s", (phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });

  it("accepts a normal email and rejects a malformed one", () => {
    expect(isValidEmail("mary@example.org")).toBe(true);
    expect(isValidEmail("mary@example")).toBe(false);
    expect(isValidEmail("not an email")).toBe(false);
  });
});
