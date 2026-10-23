import "server-only";
import { mockAppsScript } from "./appsScriptMock";

/**
 * Server-only client for the Apps Script web app (Website/apps-script/Code.gs).
 * Reads APPS_SCRIPT_URL and APPS_SCRIPT_SECRET. The secret never leaves the server and is
 * never logged. Apps Script answers through a redirect, which fetch follows.
 *
 * Without both variables, development uses an in-memory mock (see appsScriptMock.ts);
 * production treats it as an outage, so the site hides the number and shows the
 * friendly error.
 */

const TIMEOUT_MS = 10_000;

export type AppsScriptReply = { ok: boolean; error?: string; [key: string]: unknown };

type Config = { url: string; secret: string } | "mock" | null;

function config(): Config {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (url && secret) return { url, secret };
  return process.env.NODE_ENV === "production" ? null : "mock";
}

const unreachable: AppsScriptReply = { ok: false, error: "server" };

async function readJson(res: Response): Promise<AppsScriptReply> {
  try {
    const body: unknown = await res.json();
    return body && typeof body === "object" && "ok" in body ? (body as AppsScriptReply) : unreachable;
  } catch {
    return unreachable; // an HTML error page, an empty body
  }
}

/** POSTs a sign-up. Any network failure, timeout or odd reply comes back as { ok: false, error: "server" }. */
export async function appsScriptPost(payload: Record<string, unknown>): Promise<AppsScriptReply> {
  const cfg = config();
  if (cfg === "mock") return mockAppsScript.post(payload);
  if (!cfg) {
    console.error("[appsScript] APPS_SCRIPT_URL or APPS_SCRIPT_SECRET is not set");
    return unreachable;
  }
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: cfg.secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return await readJson(res);
  } catch (err) {
    console.error("[appsScript] POST failed:", err instanceof Error ? err.name : "unknown");
    return unreachable;
  }
}

/** GETs ?action=… (places, health). */
export async function appsScriptGet(action: "places" | "health"): Promise<AppsScriptReply> {
  const cfg = config();
  if (cfg === "mock") return mockAppsScript.get(action);
  if (!cfg) return unreachable;
  const url = new URL(cfg.url);
  url.searchParams.set("action", action);
  url.searchParams.set("secret", cfg.secret);
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
    return await readJson(res);
  } catch (err) {
    console.error(`[appsScript] GET ${action} failed:`, err instanceof Error ? err.name : "unknown");
    return unreachable;
  }
}
