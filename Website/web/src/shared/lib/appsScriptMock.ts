import "server-only";
import type { AppsScriptReply } from "./appsScript";

/**
 * Development stand-in for the Apps Script web app, used when APPS_SCRIPT_URL is not set.
 * It mirrors the real replies (see Website/apps-script/README.md) and keeps sign-ups in
 * memory until the dev server restarts.
 *
 * To try the server error, put a tag in the email: `you+error@x.org`.
 */

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

    return { ok: true, strangerId, updated };
  },

  async get(action: "health"): Promise<AppsScriptReply> {
    return { ok: true, action, time: new Date().toISOString() };
  },
};
