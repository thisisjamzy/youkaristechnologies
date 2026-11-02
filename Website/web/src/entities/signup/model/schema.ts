import { z } from "zod";
import { CONTACT_LIMITS, isValidEmail, isValidPhone } from "@/shared/lib/contact";

/**
 * The Home sign-up contract, shared by the form, the /api/signup route and (by mirroring)
 * Website/apps-script/Code.gs. Limits, patterns and error codes match the backend's.
 */
export const LIMITS = { name: 120, place: 160, ...CONTACT_LIMITS } as const;

/** Error codes, as the backend returns them. */
export type FieldErrorCode = "required" | "invalid" | "too_long";

export const signupFields = ["baptismName", "phone", "parish", "city", "email"] as const;

export type SignupField = (typeof signupFields)[number];
export type FieldErrors = Partial<Record<SignupField, FieldErrorCode>>;

const requiredText = (max: number) =>
  z.string().trim().min(1, { error: "required" }).max(max, { error: "too_long" });

export const signupSchema = z.object({
  sourcePage: z.literal("home"),
  baptismName: requiredText(LIMITS.name),
  phone: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .max(LIMITS.phone, { error: "too_long" })
    .refine(isValidPhone, { error: "invalid" }),
  parish: requiredText(LIMITS.place),
  city: requiredText(LIMITS.place),
  /** Optional: only checked when filled. */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || isValidEmail(v), { error: "invalid" })
    .default(""),
  joinAsStranger: z.literal(true),
  /** Honeypot: people never see it; bots fill it. */
  website: z.string().default(""),
});

export type SignupSchema = typeof signupSchema;
export type SignupInput = z.input<SignupSchema>;
export type SignupData = z.output<SignupSchema>;

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
