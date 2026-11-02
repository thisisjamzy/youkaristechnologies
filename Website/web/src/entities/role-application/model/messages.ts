import { strings } from "@/content/strings";
import type { ApplicationErrorCode, ApplicationField } from "./schema";

const e = strings.common.errors;
const a = e.application;

type Messages = Partial<Record<ApplicationErrorCode, string>> & { fallback: string };

// Inputs carry maxLength, so "too long" on names only reaches people who bypass the form; it
// then reuses the field's own message rather than inventing new copy.
const messages: Record<ApplicationField, Messages> = {
  roleId: { fallback: a.roleMissing },
  fullName: { fallback: e.fullNameMissing },
  baptismName: { fallback: e.baptismNameMissing },
  phone: { required: e.phoneMissing, fallback: e.phoneInvalid },
  email: { required: e.emailMissing, fallback: e.emailInvalid },
  parish: { fallback: e.parishMissing },
  city: { fallback: e.cityMissing },
  q1: { too_long: a.answerTooLong, fallback: a.answerMissing },
  q2: { too_long: a.answerTooLong, fallback: a.answerMissing },
  q3: { too_long: a.answerTooLong, fallback: a.answerMissing },
  links: { required: a.linkMissing, fallback: a.linkInvalid },
  cv: { invalid_type: a.cvWrongType, invalid: a.cvWrongType, too_large: a.cvTooLarge, fallback: a.cvMissing },
  hours: { fallback: a.timeMissing },
  confirmUnpaid: { fallback: a.unpaidNotConfirmed },
  confirmSunday: { fallback: a.sundayNotConfirmed },
  confirmRosary: { fallback: a.rosaryNotConfirmed },
};

/** The message from strings.common.errors for an application field error. */
export function applicationErrorMessage(field: ApplicationField, code: ApplicationErrorCode): string {
  const m = messages[field];
  return m[code] ?? m.fallback;
}
