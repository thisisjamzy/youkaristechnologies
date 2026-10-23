import type { SignupData } from "./schema";

/** The JSON body the Apps Script web app expects, minus the secret (added server-side). */
export type AppsScriptSignupPayload = {
  action: "signup";
  sourcePage: "home" | "build-with-us";
  fullName: string;
  baptismName: string;
  email: string;
  parish: string;
  city: string;
  whatsapp: string;
  joinAsStranger: boolean;
  applyCoreTeam: boolean;
  teams: string[];
  about: string;
  submittedAt: string;
};

/** Maps validated form data to the backend's field names and team names. */
export function toAppsScriptPayload<T extends string>(
  data: SignupData<T>,
  teamName: (id: T) => string,
  submittedAt: Date,
): AppsScriptSignupPayload {
  return {
    action: "signup",
    sourcePage: data.sourcePage,
    fullName: data.fullName,
    baptismName: data.baptismName,
    email: data.email,
    parish: data.parish,
    city: data.city,
    whatsapp: data.whatsApp,
    joinAsStranger: data.joinAsStranger,
    applyCoreTeam: data.applyCoreTeam,
    // Teams only travel with a core team application.
    teams: data.applyCoreTeam ? data.teams.map(teamName) : [],
    about: data.applyCoreTeam ? data.about : "",
    submittedAt: submittedAt.toISOString(),
  };
}

/** Backend field names → ours, for validation errors coming back. */
export const backendFieldNames: Record<string, string> = {
  fullName: "fullName",
  baptismName: "baptismName",
  email: "email",
  parish: "parish",
  city: "city",
  whatsapp: "whatsApp",
  teams: "teams",
  about: "about",
  choice: "choice",
};
