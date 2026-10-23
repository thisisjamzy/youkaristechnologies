import type { FieldErrors } from "./schema";

/** What /api/signup answers. The browser only ever sees these shapes. */
export type SignupResponse =
  | { ok: true; placesLeft: number | null; coreTeamFull: boolean }
  | { ok: false; error: "validation"; fields: FieldErrors }
  | { ok: false; error: "rate_limited" | "server" };
