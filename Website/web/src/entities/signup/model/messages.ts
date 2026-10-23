import { strings } from "@/content/strings";
import type { FieldErrorCode, SignupField } from "./schema";

const e = strings.common.errors;

// Inputs carry maxLength, so "too long" only reaches people who bypass the form; it then
// reuses the field's own message rather than inventing new copy.
const messages: Record<SignupField, Partial<Record<FieldErrorCode, string>> & { fallback: string }> = {
  fullName: { fallback: e.fullNameMissing },
  baptismName: { fallback: e.baptismNameMissing },
  email: { required: e.emailMissing, fallback: e.emailInvalid },
  parish: { fallback: e.parishMissing },
  city: { fallback: e.cityMissing },
  whatsApp: { fallback: e.whatsAppInvalid },
  choice: { fallback: e.noChoice },
  teams: { fallback: e.server },
  about: { fallback: e.server },
};

/** The message from strings.common.errors for a field error. */
export function fieldErrorMessage(field: SignupField, code: FieldErrorCode): string {
  const m = messages[field];
  return m[code] ?? m.fallback;
}
