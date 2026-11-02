import { describe, expect, it } from "vitest";
import { checkCvFile, cvKindFromName, sniffCvKind } from "./cv";

const bytes = (...b: number[]) => new Uint8Array(b);

describe("sniffCvKind", () => {
  it("recognises PDF, DOCX and DOC by their first bytes", () => {
    expect(sniffCvKind(new TextEncoder().encode("%PDF-1.7"))).toBe("pdf");
    expect(sniffCvKind(bytes(0x50, 0x4b, 0x03, 0x04))).toBe("docx");
    expect(sniffCvKind(bytes(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1))).toBe("doc");
  });

  it("rejects anything else, including a renamed text file", () => {
    expect(sniffCvKind(new TextEncoder().encode("Dear team, here is my CV"))).toBeUndefined();
    expect(sniffCvKind(bytes())).toBeUndefined();
  });
});

describe("checkCvFile", () => {
  it("reads the extension, whatever its case", () => {
    expect(cvKindFromName("CV.PDF")).toBe("pdf");
    expect(cvKindFromName("cv.pages")).toBeUndefined();
  });

  it("treats an empty file input as no file", () => {
    expect(checkCvFile({ name: "", size: 0, type: "application/octet-stream" })).toBe("required");
    expect(checkCvFile(null)).toBe("required");
  });

  it("rejects an empty file with a CV name", () => {
    expect(checkCvFile({ name: "cv.pdf", size: 0, type: "application/pdf" })).toBe("invalid_type");
  });
});
