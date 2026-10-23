import { useState } from "react";
import { strings } from "@/content/strings";
import { postSignup } from "../api/postSignup";
import { fieldErrorMessage } from "./messages";
import { toFieldErrors, type FieldErrors, type SignupField, type SignupSchema } from "./schema";

export type SubmissionStatus = "idle" | "sending" | "sent";

export type SignupSubmission = {
  status: SubmissionStatus;
  /** Error message per field, from strings.common.errors. */
  errors: Partial<Record<SignupField, string>>;
  /** A message for the whole form (network, rate limit, team full). */
  formError: string | null;
  /** The person was saved as a stranger, but the core team was full. */
  coreTeamFull: boolean;
  /** Validates, then sends. Returns the first invalid field, if any, so the form can focus it. */
  submit: (input: unknown) => Promise<SignupField | null>;
  reset: () => void;
};

const e = strings.common.errors;

const toMessages = (fields: FieldErrors) =>
  Object.fromEntries(
    Object.entries(fields).map(([field, code]) => [field, fieldErrorMessage(field as SignupField, code)]),
  ) as Partial<Record<SignupField, string>>;

/** Form state for both sign-up forms: browser validation, sending, and the server's answer. */
export function useSignupSubmission<T extends string>(schema: SignupSchema<T>): SignupSubmission {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<SignupField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [coreTeamFull, setCoreTeamFull] = useState(false);

  const fail = (fields: FieldErrors): SignupField | null => {
    setErrors(toMessages(fields));
    setStatus("idle");
    return (Object.keys(fields)[0] as SignupField | undefined) ?? null;
  };

  const submit = async (input: unknown): Promise<SignupField | null> => {
    if (status === "sending") return null;
    setFormError(null);
    const parsed = schema.safeParse(input);
    if (!parsed.success) return fail(toFieldErrors(parsed.error));

    setErrors({});
    setStatus("sending");
    const res = await postSignup(parsed.data);

    if (res.ok) {
      setCoreTeamFull(res.coreTeamFull);
      setStatus("sent");
      return null;
    }
    if (res.error === "validation") return fail(res.fields);
    setFormError(res.error === "rate_limited" ? e.tooManyAttempts : e.server);
    setStatus("idle");
    return null;
  };

  const reset = () => {
    setStatus("idle");
    setErrors({});
    setFormError(null);
    setCoreTeamFull(false);
  };

  return { status, errors, formError, coreTeamFull, submit, reset };
}
