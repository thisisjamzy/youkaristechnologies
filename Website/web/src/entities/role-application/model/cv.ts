/**
 * CV rules, shared by the form, /api/apply and (by mirroring) CV_TYPES in
 * Website/apps-script/Code.gs: PDF or Word, at most 4 MB.
 */

export const CV_MAX_BYTES = 4 * 1024 * 1024;

/** File extension → the MIME type the backend accepts for it. */
export const CV_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export type CvKind = keyof typeof CV_TYPES;

/** For the file input's `accept`. */
export const CV_ACCEPT = Object.keys(CV_TYPES)
  .map((ext) => `.${ext}`)
  .join(",");

export type CvError = "required" | "invalid_type" | "too_large";

/** What the browser tells us about a file: enough to check it without reading it. */
export type CvFileInfo = { name: string; size: number; type: string };

export function cvKindFromName(name: string): CvKind | undefined {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return ext in CV_TYPES ? (ext as CvKind) : undefined;
}

/**
 * Checks the extension and the browser's MIME type. Some browsers report Word files with no
 * type or as a generic binary, so those pass here; the first bytes are checked on the server.
 */
export function checkCvFile(file: CvFileInfo | null | undefined): CvError | null {
  if (!file || (file.size === 0 && file.name === "")) return "required";
  const kind = cvKindFromName(file.name);
  if (!kind) return "invalid_type";
  const known = Object.values(CV_TYPES) as string[];
  const typeOk = file.type === "" || file.type === "application/octet-stream" || known.includes(file.type);
  if (!typeOk) return "invalid_type";
  if (file.size === 0) return "invalid_type";
  if (file.size > CV_MAX_BYTES) return "too_large";
  return null;
}

const startsWith = (bytes: Uint8Array, signature: readonly number[]) =>
  signature.every((byte, i) => bytes[i] === byte);

/**
 * What the file really is, from its first bytes: PDF (`%PDF`), DOCX (a zip: `PK`) or DOC
 * (an OLE compound file: `D0 CF 11 E0`). Undefined for anything else, e.g. a renamed text file.
 */
export function sniffCvKind(bytes: Uint8Array): CvKind | undefined {
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46])) return "pdf";
  if (startsWith(bytes, [0x50, 0x4b])) return "docx";
  if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0])) return "doc";
  return undefined;
}
