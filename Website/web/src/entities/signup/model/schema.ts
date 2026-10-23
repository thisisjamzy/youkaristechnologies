import { z } from "zod";

/**
 * The sign-up contract, shared by both forms, the /api/signup route and (by mirroring)
 * Website/apps-script/Code.gs. Limits, patterns and error codes match the backend's.
 */
export const LIMITS = { name: 120, place: 160, whatsApp: 40, about: 2000, email: 254 } as const;

/** Error codes, as the backend returns them. */
export type FieldErrorCode = "required" | "invalid" | "too_long";

export const signupFields = [
  "fullName",
  "baptismName",
  "email",
  "parish",
  "city",
  "whatsApp",
  "teams",
  "about",
  "choice",
] as const;

export type SignupField = (typeof signupFields)[number];
export type FieldErrors = Partial<Record<SignupField, FieldErrorCode>>;

// Same patterns as the backend.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP = /^[+0-9 ()-]{6,}$/;

const requiredText = (max: number) =>
  z.string().trim().min(1, { error: "required" }).max(max, { error: "too_long" });

/**
 * Builds the schema for the given team ids (from entities/team; passed in because
 * entities do not import each other).
 */
export function createSignupSchema<T extends string>(teamIds: readonly [T, ...T[]]) {
  return z
    .object({
      sourcePage: z.enum(["home", "build-with-us"]),
      fullName: requiredText(LIMITS.name),
      baptismName: requiredText(LIMITS.name),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { error: "required" })
        .max(LIMITS.email, { error: "invalid" })
        .regex(EMAIL, { error: "invalid" }),
      parish: requiredText(LIMITS.place),
      city: requiredText(LIMITS.place),
      whatsApp: z
        .string()
        .trim()
        .max(LIMITS.whatsApp, { error: "too_long" })
        .refine((v) => v === "" || WHATSAPP.test(v), { error: "invalid" })
        .default(""),
      joinAsStranger: z.boolean(),
      applyCoreTeam: z.boolean(),
      teams: z.array(z.enum(teamIds), { error: "invalid" }).default([]),
      about: z.string().trim().max(LIMITS.about, { error: "too_long" }).default(""),
      /** Honeypot: people never see it; bots fill it. */
      website: z.string().default(""),
    })
    .refine((d) => d.joinAsStranger || d.applyCoreTeam, { path: ["choice"], error: "required" });
}

export type SignupSchema<T extends string = string> = ReturnType<typeof createSignupSchema<T>>;
export type SignupInput<T extends string = string> = z.input<SignupSchema<T>>;
export type SignupData<T extends string = string> = z.output<SignupSchema<T>>;

/** Zod issues → one code per field (the first issue wins). */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string" || !(signupFields as readonly string[]).includes(field)) continue;
    const key = field as SignupField;
    if (out[key]) continue;
    const code = issue.message as FieldErrorCode;
    out[key] = code === "required" || code === "too_long" ? code : "invalid";
  }
  return out;
}
