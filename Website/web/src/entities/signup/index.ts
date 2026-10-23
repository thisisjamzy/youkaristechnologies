// Public API of the signup entity: safe on the server and in the browser.
// Browser-only pieces (the form hook, the fetch to /api/signup) are in ./client.
export {
  createSignupSchema,
  toFieldErrors,
  LIMITS,
  signupFields,
  type FieldErrorCode,
  type FieldErrors,
  type SignupData,
  type SignupField,
  type SignupInput,
  type SignupSchema,
} from "./model/schema";
export { toAppsScriptPayload, backendFieldNames, type AppsScriptSignupPayload } from "./model/payload";
export { fieldErrorMessage } from "./model/messages";
export type { SignupResponse } from "./model/response";
