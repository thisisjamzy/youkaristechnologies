import type { ApplyResponse } from "../model/response";

/** Sends the application, CV included, as multipart form data to our own API route. */
export async function postApplication(body: FormData): Promise<ApplyResponse> {
  try {
    const res = await fetch("/api/apply", { method: "POST", body });
    return (await res.json()) as ApplyResponse;
  } catch {
    return { ok: false, error: "server" };
  }
}
