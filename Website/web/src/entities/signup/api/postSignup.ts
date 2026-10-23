import type { SignupResponse } from "../model/response";

/** Sends a sign-up to our own API route (never to the backend directly). */
export async function postSignup(body: unknown): Promise<SignupResponse> {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as SignupResponse;
  } catch {
    return { ok: false, error: "server" };
  }
}
