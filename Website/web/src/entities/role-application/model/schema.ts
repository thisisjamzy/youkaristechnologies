import { z } from "zod";
import { CONTACT_LIMITS, isValidEmail, isValidPhone } from "@/shared/lib/contact";
import { checkCvFile, type CvFileInfo } from "./cv";

/**
 * The role application contract, used by the form in the browser and again by /api/apply.
 * Limits and codes mirror validateApply_ in Website/apps-script/Code.gs.
 */
export const LIMITS = { name: 120, place: 160, answer: 3000, links: 600, ...CONTACT_LIMITS } as const;

/** Show the live character count once an answer passes this length. */
export const ANSWER_COUNT_FROM = 2500;

export const HOURS_OPTIONS = ["Up to 3 hours", "4 to 6 hours", "7 hours or more"] as const;

export type ApplicationErrorCode = "required" | "invalid" | "too_long" | "invalid_type" | "too_large";

export const applicationFields = [
  "roleId",
  "fullName",
  "baptismName",
  "phone",
  "email",
  "parish",
  "city",
  "q1",
  "q2",
  "q3",
  "links",
  "cv",
  "hours",
  "confirmUnpaid",
  "confirmSunday",
  "confirmRosary",
] as const;

export type ApplicationField = (typeof applicationFields)[number];
export type ApplicationErrors = Partial<Record<ApplicationField, ApplicationErrorCode>>;

/** The little the schema needs to know about each role (passed in: entities do not import each other). */
export type RoleRule = { id: string; application: { linkRequired: boolean } };

const LINK = /^https?:\/\/\S+$/i;

const requiredText = (max: number) =>
  z.string().trim().min(1, { error: "required" }).max(max, { error: "too_long" });

const confirmed = z.literal(true, { error: "required" });

/** A browser File (form) or an undici File (route): anything with a name, size and type. */
const isFileInfo = (v: unknown): v is CvFileInfo =>
  typeof v === "object" && v !== null && "name" in v && "size" in v && "type" in v;

export function createApplicationSchema(roles: readonly RoleRule[]) {
  const ids = roles.map((r) => r.id);
  const linkRequired = (id: unknown) => roles.some((r) => r.id === id && r.application.linkRequired);
  return z
    .object({
      roleId: z.string().refine((id) => ids.includes(id), { error: (i) => (i.input === "" ? "required" : "invalid") }),
      fullName: requiredText(LIMITS.name),
      baptismName: requiredText(LIMITS.name),
      phone: z
        .string()
        .trim()
        .min(1, { error: "required" })
        .max(LIMITS.phone, { error: "too_long" })
        .refine(isValidPhone, { error: "invalid" }),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { error: "required" })
        .refine(isValidEmail, { error: "invalid" }),
      parish: requiredText(LIMITS.place),
      city: requiredText(LIMITS.place),
      q1: requiredText(LIMITS.answer),
      q2: requiredText(LIMITS.answer),
      q3: requiredText(LIMITS.answer),
      links: z
        .string()
        .trim()
        .max(LIMITS.links, { error: "too_long" })
        .refine((v) => v === "" || LINK.test(v), { error: "invalid" })
        .default(""),
      cv: z
        .custom<CvFileInfo | null | undefined>((v) => v === undefined || v === null || isFileInfo(v))
        .superRefine((file, ctx) => {
          const cvError = checkCvFile(file);
          if (cvError) ctx.addIssue({ code: "custom", message: cvError });
        }),
      hours: z.enum(HOURS_OPTIONS, { error: "required" }),
      confirmUnpaid: confirmed,
      confirmSunday: confirmed,
      confirmRosary: confirmed,
      joinAsStranger: z.boolean(),
      /** Honeypot: people never see it; bots fill it. */
      website: z.string().default(""),
    })
    .refine((data) => !(linkRequired(data.roleId) && data.links === ""), {
      path: ["links"],
      error: "required",
      // Runs even when other fields are invalid, so every error shows at once.
      when: ({ value }) => typeof value === "object" && value !== null && "roleId" in value && "links" in value,
    });
}

export type ApplicationSchema = ReturnType<typeof createApplicationSchema>;
export type ApplicationInput = z.input<ApplicationSchema>;
export type ApplicationData = z.output<ApplicationSchema>;

/** Zod issues → one code per field (the first issue wins). */
export function toApplicationErrors(error: z.ZodError): ApplicationErrors {
  const out: ApplicationErrors = {};
  const codes: readonly string[] = ["required", "invalid", "too_long", "invalid_type", "too_large"];
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string" || !(applicationFields as readonly string[]).includes(field)) continue;
    const key = field as ApplicationField;
    if (out[key]) continue;
    out[key] = (codes.includes(issue.message) ? issue.message : "invalid") as ApplicationErrorCode;
  }
  return out;
}

/** The form's fields → schema input. Shared by the form and the route, so both read the same names. */
export function applicationFromFormData(data: FormData): ApplicationInput {
  const text = (name: string) => {
    const value = data.get(name);
    return typeof value === "string" ? value : "";
  };
  const ticked = (name: string) => data.get(name) === "on";
  const cv = data.get("cv");
  return {
    roleId: text("roleId"),
    fullName: text("fullName"),
    baptismName: text("baptismName"),
    phone: text("phone"),
    email: text("email"),
    parish: text("parish"),
    city: text("city"),
    q1: text("q1"),
    q2: text("q2"),
    q3: text("q3"),
    links: text("links"),
    cv: isFileInfo(cv) ? cv : null,
    hours: text("hours") as ApplicationInput["hours"],
    confirmUnpaid: ticked("confirmUnpaid") as true,
    confirmSunday: ticked("confirmSunday") as true,
    confirmRosary: ticked("confirmRosary") as true,
    joinAsStranger: ticked("joinAsStranger"),
    website: text("website"),
  };
}
