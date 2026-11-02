// Public API of the role application entity: safe on the server and in the browser.
export {
  ANSWER_COUNT_FROM,
  HOURS_OPTIONS,
  LIMITS,
  applicationFields,
  applicationFromFormData,
  createApplicationSchema,
  toApplicationErrors,
  type ApplicationData,
  type ApplicationErrorCode,
  type ApplicationErrors,
  type ApplicationField,
  type ApplicationInput,
  type ApplicationSchema,
  type RoleRule,
} from "./model/schema";
export {
  CV_ACCEPT,
  CV_MAX_BYTES,
  CV_TYPES,
  checkCvFile,
  cvKindFromName,
  sniffCvKind,
  type CvError,
  type CvKind,
} from "./model/cv";
export { applicationErrorMessage } from "./model/messages";
export { toAppsScriptApplyPayload, type AppsScriptApplyPayload, type AppsScriptCv } from "./model/payload";
export type { ApplyResponse } from "./model/response";
