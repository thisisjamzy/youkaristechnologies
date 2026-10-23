import { revalidateTag } from "next/cache";
import {
  backendFieldNames,
  createSignupSchema,
  signupFields,
  toAppsScriptPayload,
  toFieldErrors,
  type FieldErrorCode,
  type FieldErrors,
  type SignupField,
  type SignupResponse,
} from "@/entities/signup";
import { teamApiNames, teamIds } from "@/entities/team";
import { PLACES_TAG } from "@/features/show-places-left";
import { appsScriptPost } from "@/shared/lib/appsScript";
import { createRateLimiter } from "@/shared/lib";

const schema = createSignupSchema(teamIds);
const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

const reply = (body: SignupResponse, status = 200) => Response.json(body, { status });

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** Backend validation fields → ours. Unknown fields are dropped. */
function mapBackendFields(fields: unknown): FieldErrors {
  const out: FieldErrors = {};
  if (!fields || typeof fields !== "object") return out;
  for (const [name, code] of Object.entries(fields)) {
    const ours = backendFieldNames[name];
    if (!ours || !(signupFields as readonly string[]).includes(ours)) continue;
    out[ours as SignupField] = (code === "required" || code === "too_long" ? code : "invalid") as FieldErrorCode;
  }
  return out;
}

/**
 * POST /api/signup: validates with the shared schema, then forwards to the Apps Script
 * backend. Never exposes the secret or raw backend errors.
 */
export async function POST(request: Request) {
  if (!limiter.allow(clientIp(request))) return reply({ ok: false, error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "validation", fields: {} }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return reply({ ok: false, error: "validation", fields: toFieldErrors(parsed.error) }, 400);
  }

  // Honeypot filled: look successful, store nothing.
  if (parsed.data.website !== "") return reply({ ok: true, placesLeft: null, coreTeamFull: false });

  const payload = toAppsScriptPayload(parsed.data, (id) => teamApiNames[id], new Date());
  const result = await appsScriptPost(payload);

  if (result.ok) {
    if (payload.applyCoreTeam) revalidateTag(PLACES_TAG, "max");
    const placesLeft = typeof result.placesLeft === "number" ? result.placesLeft : null;
    return reply({ ok: true, placesLeft, coreTeamFull: false });
  }

  switch (result.error) {
    case "core_team_full":
      // The backend still saved them as a stranger.
      revalidateTag(PLACES_TAG, "max");
      return reply({ ok: true, placesLeft: 0, coreTeamFull: true });
    case "validation":
      return reply({ ok: false, error: "validation", fields: mapBackendFields(result.fields) }, 400);
    default:
      // unauthorised, unknown_action, server, timeouts: one friendly answer.
      console.error("[signup] backend refused:", result.error);
      return reply({ ok: false, error: "server" }, 502);
  }
}
