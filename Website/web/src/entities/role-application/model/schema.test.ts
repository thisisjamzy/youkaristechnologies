import { describe, expect, it } from "vitest";
import { toAppsScriptApplyPayload } from "./payload";
import {
  applicationFromFormData,
  createApplicationSchema,
  toApplicationErrors,
  type ApplicationInput,
} from "./schema";

const roles = [
  { id: "logistics-officer", application: { linkRequired: false } },
  { id: "brand-and-graphic-designer", application: { linkRequired: true } },
];
const schema = createApplicationSchema(roles);

const pdf = () => new File(["%PDF-1.7 test"], "mary-cv.pdf", { type: "application/pdf" });

const valid = (): ApplicationInput => ({
  roleId: "logistics-officer",
  fullName: "Mary Ndi",
  baptismName: "Mary",
  phone: "+237 6 70 00 00 00",
  email: "Mary@Example.org",
  parish: "St Anthony",
  city: "Buea, Cameroon",
  q1: "Because",
  q2: "A time",
  q3: "Another time",
  links: "",
  cv: pdf(),
  hours: "4 to 6 hours",
  confirmUnpaid: true,
  confirmSunday: true,
  confirmRosary: true,
  joinAsStranger: true,
});

const errorsFor = (input: unknown) => {
  const result = schema.safeParse(input);
  return result.success ? {} : toApplicationErrors(result.error);
};

describe("application schema", () => {
  it("accepts a complete application and normalises the email", () => {
    const result = schema.safeParse(valid());
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("mary@example.org");
  });

  it("requires every field a person fills in", () => {
    const blank = { ...valid(), roleId: "", fullName: "", baptismName: "", phone: "", email: "", parish: "", city: "" };
    expect(errorsFor({ ...blank, q1: "", q2: " ", q3: "", hours: "", cv: null })).toEqual({
      roleId: "required",
      fullName: "required",
      baptismName: "required",
      phone: "required",
      email: "required",
      parish: "required",
      city: "required",
      q1: "required",
      q2: "required",
      q3: "required",
      hours: "required",
      cv: "required",
    });
  });

  it("only takes the listed roles, never the appointed Core and Content Lead", () => {
    expect(errorsFor({ ...valid(), roleId: "core-and-content-lead-and-network-chaplain" })).toEqual({ roleId: "invalid" });
    expect(errorsFor({ ...valid(), roleId: "catering" })).toEqual({ roleId: "invalid" });
  });

  it("checks email and phone formats as on Home", () => {
    expect(errorsFor({ ...valid(), email: "nope", phone: "call me" })).toEqual({ email: "invalid", phone: "invalid" });
  });

  it("keeps answers between 1 and 3000 characters", () => {
    expect(errorsFor({ ...valid(), q2: "a".repeat(3000) })).toEqual({});
    expect(errorsFor({ ...valid(), q2: "a".repeat(3001) })).toEqual({ q2: "too_long" });
  });

  it("needs a full link when one is given, and a portfolio link for the designer", () => {
    expect(errorsFor({ ...valid(), links: "www.example.org" })).toEqual({ links: "invalid" });
    expect(errorsFor({ ...valid(), links: "https://example.org/work" })).toEqual({});
    expect(errorsFor({ ...valid(), roleId: "brand-and-graphic-designer" })).toEqual({ links: "required" });
    expect(errorsFor({ ...valid(), roleId: "brand-and-graphic-designer", links: "http://mary.design" })).toEqual({});
  });

  it("reports the missing portfolio and CV together with other errors", () => {
    expect(errorsFor({ ...valid(), roleId: "brand-and-graphic-designer", fullName: "", cv: null })).toEqual({
      fullName: "required",
      links: "required",
      cv: "required",
    });
  });

  it.each(["confirmUnpaid", "confirmSunday", "confirmRosary"] as const)("requires %s", (field) => {
    expect(errorsFor({ ...valid(), [field]: false })).toEqual({ [field]: "required" });
  });

  it("keeps joining as a stranger optional", () => {
    expect(errorsFor({ ...valid(), joinAsStranger: false })).toEqual({});
  });

  it("only takes a PDF or Word CV of at most 4 MB", () => {
    const text = new File(["hello"], "cv.txt", { type: "text/plain" });
    const disguised = new File(["hello"], "cv.pdf", { type: "text/plain" });
    const big = { name: "cv.pdf", size: 4 * 1024 * 1024 + 1, type: "application/pdf" };
    const docx = new File(["PK.."], "cv.docx", { type: "" });
    expect(errorsFor({ ...valid(), cv: text })).toEqual({ cv: "invalid_type" });
    expect(errorsFor({ ...valid(), cv: disguised })).toEqual({ cv: "invalid_type" });
    expect(errorsFor({ ...valid(), cv: big })).toEqual({ cv: "too_large" });
    expect(errorsFor({ ...valid(), cv: docx })).toEqual({});
  });

  it("only takes the three time options", () => {
    expect(errorsFor({ ...valid(), hours: "All week" })).toEqual({ hours: "required" });
  });
});

describe("applicationFromFormData", () => {
  it("reads the form's field names, ticks and file", () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries({ roleId: "logistics-officer", fullName: "Mary Ndi", hours: "Up to 3 hours" })) {
      fd.set(k, v);
    }
    fd.set("confirmUnpaid", "on");
    fd.set("cv", pdf());
    const input = applicationFromFormData(fd);
    expect(input).toMatchObject({ roleId: "logistics-officer", fullName: "Mary Ndi", confirmUnpaid: true, confirmSunday: false });
    expect(input.cv?.name).toBe("mary-cv.pdf");
  });
});

describe("toAppsScriptApplyPayload", () => {
  it("builds the backend body with the server's question texts", () => {
    const data = schema.parse({ ...valid(), links: "https://example.org" });
    const cv = { fileName: "mary-cv.pdf", mimeType: "application/pdf", base64: "JVBERg==" };
    const payload = toAppsScriptApplyPayload(data, ["Q one", "Q two", "Q three"], cv, new Date("2026-11-03T09:00:00Z"));
    expect(payload).toEqual({
      action: "apply",
      sourcePage: "roles",
      roleId: "logistics-officer",
      questions: ["Q one", "Q two", "Q three"],
      answers: { q1: "Because", q2: "A time", q3: "Another time" },
      fullName: "Mary Ndi",
      baptismName: "Mary",
      phone: "+237 6 70 00 00 00",
      email: "mary@example.org",
      parish: "St Anthony",
      city: "Buea, Cameroon",
      links: "https://example.org",
      hours: "4 to 6 hours",
      confirmUnpaid: true,
      confirmSunday: true,
      confirmRosary: true,
      joinAsStranger: true,
      cv,
      submittedAt: "2026-11-03T09:00:00.000Z",
    });
  });
});
