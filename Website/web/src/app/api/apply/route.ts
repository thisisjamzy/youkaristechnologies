import {
  CV_MAX_BYTES,
  CV_TYPES,
  applicationFields,
  applicationFromFormData,
  createApplicationSchema,
  sniffCvKind,
  toAppsScriptApplyPayload,
  toApplicationErrors,
  type ApplicationErrorCode,
  type ApplicationErrors,
  type ApplicationField,
  type ApplyResponse,
} from "@/entities/role-application";
import { findRole, roles } from "@/entities/role";
import { createRateLimiter } from "@/shared/lib";
import { appsScriptPost } from "@/shared/lib/appsScript";

// Node is the default (and, with Cache Components, the only) runtime, which Buffer needs.

/** Seconds the host may let this route run: the backend's Drive upload and email are slow. */
export const maxDuration = 60;

/** How long to wait for the backend, inside maxDuration. */
const BACKEND_TIMEOUT_MS = 45_000;

const schema = createApplicationSchema(roles);
const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

/** A 4 MB CV plus the other fields; also under Vercel's 4.5 MB request limit. */
const MAX_REQUEST_BYTES = CV_MAX_BYTES + 256 * 1024;

const reply = (body: ApplyResponse, status = 200) => Response.json(body, { status });
const invalid = (fields: ApplicationErrors) => reply({ ok: false, error: "validation", fields }, 400);

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** Reads the body, but stops as soon as it passes `max` bytes, so a huge upload is never held in full. */
async function readCapped(request: Request, max: number): Promise<Uint8Array<ArrayBuffer> | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > max) return null;
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

/** Backend validation fields → ours. Unknown fields are dropped. */
function mapBackendFields(fields: unknown): ApplicationErrors {
  const out: ApplicationErrors = {};
  if (!fields || typeof fields !== "object") return out;
  const codes: readonly string[] = ["required", "invalid", "too_long", "invalid_type", "too_large"];
  for (const [name, code] of Object.entries(fields)) {
    if (!(applicationFields as readonly string[]).includes(name)) continue;
    out[name as ApplicationField] = (codes.includes(String(code)) ? code : "invalid") as ApplicationErrorCode;
  }
  return out;
}

/**
 * POST /api/apply: a role application as multipart form data. Validates with the same schema
 * as the form, checks the CV really is a PDF or Word file, attaches the role's questions from
 * our own copy, and forwards it to the Apps Script backend with the CV in base64.
 * Never logs the file or the secret.
 */
export async function POST(request: Request) {
  if (!limiter.allow(clientIp(request))) return reply({ ok: false, error: "rate_limited" }, 429);

  const body = await readCapped(request, MAX_REQUEST_BYTES);
  if (!body) return invalid({ cv: "too_large" });

  let form: FormData;
  try {
    form = await new Response(body, {
      headers: { "content-type": request.headers.get("content-type") ?? "" },
    }).formData();
  } catch {
    return invalid({});
  }

  const parsed = schema.safeParse(applicationFromFormData(form));
  if (!parsed.success) return invalid(toApplicationErrors(parsed.error));

  // Honeypot filled: look successful, store nothing.
  if (parsed.data.website !== "") return reply({ ok: true });

  const role = findRole(parsed.data.roleId);
  const file = form.get("cv");
  if (!role || !(file instanceof Blob)) return invalid({ roleId: "invalid" });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffCvKind(bytes);
  if (!kind) return invalid({ cv: "invalid_type" });

  const payload = toAppsScriptApplyPayload(
    parsed.data,
    role.application.questions.map((q) => q.text),
    { fileName: parsed.data.cv?.name ?? `cv.${kind}`, mimeType: CV_TYPES[kind], base64: Buffer.from(bytes).toString("base64") },
    new Date(),
  );
  const result = await appsScriptPost(payload, { timeoutMs: BACKEND_TIMEOUT_MS });

  if (result.ok) return reply({ ok: true });

  switch (result.error) {
    case "validation":
      return invalid(mapBackendFields(result.fields));
    case "applications_closed":
    case "role_closed":
      return reply({ ok: false, error: result.error }, 409);
    default:
      // unauthorised, unknown_action, server, timeouts: one friendly answer.
      console.error("[apply] backend refused:", result.error);
      return reply({ ok: false, error: "server" }, 502);
  }
}
