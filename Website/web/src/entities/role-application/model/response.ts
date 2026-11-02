import type { ApplicationErrors } from "./schema";

/** What /api/apply answers. The browser only ever sees these shapes. */
export type ApplyResponse =
  | { ok: true }
  | { ok: false; error: "validation"; fields: ApplicationErrors }
  | { ok: false; error: "applications_closed" | "role_closed" | "rate_limited" | "server" };
