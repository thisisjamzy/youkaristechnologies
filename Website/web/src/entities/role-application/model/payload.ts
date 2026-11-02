import type { ApplicationData } from "./schema";

/** The CV as the backend takes it: base64, never sent from the browser. */
export type AppsScriptCv = { fileName: string; mimeType: string; base64: string };

/** The JSON body the Apps Script `apply` action expects, minus the secret (added server-side). */
export type AppsScriptApplyPayload = {
  action: "apply";
  sourcePage: "roles";
  roleId: string;
  /** The three question texts, from the server's copy of the role. */
  questions: string[];
  answers: { q1: string; q2: string; q3: string };
  fullName: string;
  baptismName: string;
  phone: string;
  email: string;
  parish: string;
  city: string;
  links: string;
  hours: string;
  confirmUnpaid: true;
  confirmSunday: true;
  confirmRosary: true;
  joinAsStranger: boolean;
  cv: AppsScriptCv;
  submittedAt: string;
};

export function toAppsScriptApplyPayload(
  data: ApplicationData,
  questions: readonly string[],
  cv: AppsScriptCv,
  submittedAt: Date,
): AppsScriptApplyPayload {
  return {
    action: "apply",
    sourcePage: "roles",
    roleId: data.roleId,
    questions: [...questions],
    answers: { q1: data.q1, q2: data.q2, q3: data.q3 },
    fullName: data.fullName,
    baptismName: data.baptismName,
    phone: data.phone,
    email: data.email,
    parish: data.parish,
    city: data.city,
    links: data.links,
    hours: data.hours,
    confirmUnpaid: data.confirmUnpaid,
    confirmSunday: data.confirmSunday,
    confirmRosary: data.confirmRosary,
    joinAsStranger: data.joinAsStranger,
    cv,
    submittedAt: submittedAt.toISOString(),
  };
}
