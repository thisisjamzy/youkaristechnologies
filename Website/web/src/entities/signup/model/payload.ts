import type { SignupData } from "./schema";

/** The JSON body the Apps Script web app expects, minus the secret (added server-side). */
export type AppsScriptSignupPayload = {
  action: "signup";
  sourcePage: "home";
  baptismName: string;
  phone: string;
  parish: string;
  city: string;
  email: string;
  joinAsStranger: true;
  submittedAt: string;
};

/** Maps validated form data to the backend's payload. */
export function toAppsScriptPayload(data: SignupData, submittedAt: Date): AppsScriptSignupPayload {
  return {
    action: "signup",
    sourcePage: data.sourcePage,
    baptismName: data.baptismName,
    phone: data.phone,
    parish: data.parish,
    city: data.city,
    email: data.email,
    joinAsStranger: data.joinAsStranger,
    submittedAt: submittedAt.toISOString(),
  };
}

/** Backend field names → ours, for validation errors coming back. They now match one to one. */
export const backendFieldNames: Record<string, string> = {
  baptismName: "baptismName",
  phone: "phone",
  parish: "parish",
  city: "city",
  email: "email",
};
