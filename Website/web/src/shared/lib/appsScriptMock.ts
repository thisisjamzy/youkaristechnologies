import "server-only";
import type { AppsScriptReply } from "./appsScript";

/**
 * Development stand-in for the Apps Script web app, used when APPS_SCRIPT_URL is not set.
 * It mirrors the real replies (see Website/apps-script/README.md) and keeps sign-ups in
 * memory until the dev server restarts.
 *
 * To try the other replies, put a tag in the email: `you+full@x.org` → core_team_full,
 * `you+error@x.org` → server error.
 */

const TOTAL = 20;
let filled = 3; // as the real Config sheet starts
const strangers = new Map<string, string>();
let counter = 0;

const id = (prefix: string) => `${prefix}-MOCK${String(++counter).padStart(4, "0")}`;

export const mockAppsScript = {
  async post(payload: Record<string, unknown>): Promise<AppsScriptReply> {
    const email = String(payload.email ?? "");
    if (email.includes("+error")) return { ok: false, error: "server" };

    const updated = strangers.has(email);
    const strangerId = strangers.get(email) ?? id("STR");
    strangers.set(email, strangerId);

    if (payload.applyCoreTeam === true) {
      if (email.includes("+full") || filled >= TOTAL) {
        return { ok: false, error: "core_team_full", strangerId, placesLeft: Math.max(0, TOTAL - filled) };
      }
      filled += 1;
      return { ok: true, strangerId, applicationId: id("APP"), updated, placesLeft: TOTAL - filled };
    }
    return { ok: true, strangerId, applicationId: null, updated, placesLeft: TOTAL - filled };
  },

  async get(action: "places" | "health"): Promise<AppsScriptReply> {
    if (action === "health") return { ok: true, time: new Date().toISOString() };
    return { ok: true, total: TOTAL, filled, left: Math.max(0, TOTAL - filled), accepting: true };
  },
};
