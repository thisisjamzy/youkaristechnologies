"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { strings } from "@/content/strings";
import { findRole, roles, type RoleId } from "@/entities/role";
import {
  ANSWER_COUNT_FROM,
  CV_ACCEPT,
  HOURS_OPTIONS,
  LIMITS,
  applicationErrorMessage,
  applicationFields,
  applicationFromFormData,
  createApplicationSchema,
  toApplicationErrors,
  type ApplicationErrors,
  type ApplicationField,
} from "@/entities/role-application";
import { postApplication } from "@/entities/role-application/client";
import { externalLinks } from "@/shared/lib";
import {
  Button,
  Checkbox,
  FileInput,
  FormAlert,
  FormField,
  Heading,
  Honeypot,
  Select,
  SmartLink,
  SuccessState,
  TextArea,
} from "@/shared/ui";
import styles from "./ApplyForRoleForm.module.scss";

const { form: common, errors } = strings.common;
const { form, success } = strings.roles.application;
const SPACE = " ";

const schema = createApplicationSchema(roles);
const roleOptions = roles.map((role) => ({ value: role.id, label: `${role.title} (${role.team})` }));
const hourOptions = HOURS_OPTIONS.map((value, i) => ({ value, label: form.hours.options[i] }));
const questionNames = ["q1", "q2", "q3"] as const;

// The first sentence of the unpaid confirmation is bold, as in the design.
const [unpaidLead, ...unpaidRest] = form.confirmUnpaid.split(/(?<=\.) /);

/** Field errors → messages, in the order the fields appear. */
const toMessages = (fields: ApplicationErrors) =>
  Object.fromEntries(
    applicationFields.flatMap((field) => {
      const code = fields[field];
      return code ? [[field, applicationErrorMessage(field, code)]] : [];
    }),
  ) as Partial<Record<ApplicationField, string>>;

const roleFields: readonly ApplicationField[] = [...questionNames, "links"];
const withoutRoleFields = (current: Partial<Record<ApplicationField, string>>) =>
  Object.fromEntries(Object.entries(current).filter(([field]) => !roleFields.includes(field as ApplicationField)));

const formErrors = {
  applications_closed: errors.application.applicationsClosed,
  role_closed: errors.application.roleClosed,
  rate_limited: errors.tooManyAttempts,
  server: errors.application.server,
} as const;

export type ApplyForRoleFormProps = {
  /** The chosen role (from the URL), or null. */
  roleId: RoleId | null;
  /** Called when the person picks a role in the dropdown. Absent before the page is interactive. */
  onRoleChange?: (roleId: RoleId | null) => void;
  /** Fires once the application is in, so the page can update around the form. */
  onSent?: () => void;
};

/** One application for one role: its questions, a CV and the three confirmations. */
export function ApplyForRoleForm({ roleId, onRoleChange, onSent }: ApplyForRoleFormProps) {
  const role = findRole(roleId);
  const formRef = useRef<HTMLFormElement>(null);
  const successId = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ApplicationField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [lengths, setLengths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (status === "sent") document.getElementById(successId)?.focus();
  }, [status, successId]);

  // A different role has different questions: clear their answers' counts and errors.
  const [questionsFor, setQuestionsFor] = useState(roleId);
  if (questionsFor !== roleId) {
    setQuestionsFor(roleId);
    setLengths({});
    setFieldErrors((current) => withoutRoleFields(current));
  }

  const focusField = (field: ApplicationField) => {
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  };

  const fail = (fields: ApplicationErrors) => {
    const messages = toMessages(fields);
    setFieldErrors(messages);
    setStatus("idle");
    const first = applicationFields.find((field) => messages[field]);
    if (first) focusField(first);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setFormError(null);
    const data = new FormData(event.currentTarget);
    const parsed = schema.safeParse(applicationFromFormData(data));
    if (!parsed.success) return fail(toApplicationErrors(parsed.error));

    setFieldErrors({});
    setStatus("sending");
    const res = await postApplication(data);
    if (res.ok) {
      setStatus("sent");
      onSent?.();
      return;
    }
    if (res.error === "validation") return fail(res.fields);
    setFormError(formErrors[res.error]);
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <SuccessState title={success.title} titleId={successId} tone="ink">
        <p className={styles.successText}>{success.body}</p>
        <Heading as="p" text={common.passItOn} size="48" tracking="tighter" />
      </SuccessState>
    );
  }

  const sending = status === "sending";
  const error = (field: ApplicationField) => fieldErrors[field];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={styles.form} aria-busy={sending}>
      <Honeypot />
      <Select
        label={form.role.label}
        name="roleId"
        placeholder={form.role.empty}
        options={roleOptions}
        value={role?.id ?? ""}
        onChange={(e) => onRoleChange?.(findRole(e.target.value)?.id ?? null)}
        required
        error={error("roleId")}
      />
      <div className={styles.pair}>
        <FormField
          {...common.fullName}
          variant="box"
          name="fullName"
          autoComplete="name"
          maxLength={LIMITS.name}
          required
          error={error("fullName")}
        />
        <FormField
          {...common.baptismName}
          variant="box"
          name="baptismName"
          maxLength={LIMITS.name}
          required
          error={error("baptismName")}
        />
      </div>
      <div className={styles.pair}>
        <FormField
          {...common.phone}
          variant="box"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          required
          error={error("phone")}
        />
        <FormField
          {...common.email}
          variant="box"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          required
          error={error("email")}
        />
      </div>
      <div className={styles.pair}>
        <FormField
          {...common.parish}
          variant="box"
          name="parish"
          maxLength={LIMITS.place}
          required
          error={error("parish")}
        />
        <FormField
          {...common.city}
          variant="box"
          name="city"
          autoComplete="address-level2"
          maxLength={LIMITS.place}
          required
          error={error("city")}
        />
      </div>

      {role ? (
        // Keyed by role, so switching roles starts the answers afresh.
        <div key={role.id} className={styles.questions}>
          <span className={styles.questionsLabel}>{form.questionsLabel}</span>
          {role.application.questions.map((question, i) => {
            const name = questionNames[i];
            const length = lengths[name] ?? 0;
            return (
              <TextArea
                key={question.id}
                label={question.text}
                variant="box"
                name={name}
                rows={3}
                placeholder={form.answerPlaceholder}
                maxLength={LIMITS.answer}
                required
                onChange={(e) => setLengths((l) => ({ ...l, [name]: e.target.value.length }))}
                note={length >= ANSWER_COUNT_FROM ? `${length} / ${LIMITS.answer}` : undefined}
                error={error(name)}
              />
            );
          })}
          <FormField
            label={role.application.linkLabel}
            variant="box"
            name="links"
            type="url"
            inputMode="url"
            placeholder={form.linkPlaceholder}
            maxLength={LIMITS.links}
            required={role.application.linkRequired}
            error={error("links")}
          />
        </div>
      ) : (
        <p className={styles.noRole}>{form.noRole}</p>
      )}

      <FileInput
        label={form.cv.label}
        name="cv"
        buttonLabel={form.cv.upload}
        changeLabel={form.cv.change}
        emptyLabel={form.cv.empty}
        hint={form.cv.hint}
        accept={CV_ACCEPT}
        required
        error={error("cv")}
      />
      <Select
        label={form.hours.label}
        name="hours"
        placeholder={form.hours.empty}
        options={hourOptions}
        required
        error={error("hours")}
      />

      <fieldset className={styles.confirm}>
        <legend className={styles.legend}>{form.confirmLegend}</legend>
        <ConfirmBox name="confirmUnpaid" error={error("confirmUnpaid")}>
          <b>{unpaidLead}</b>
          {SPACE}
          {unpaidRest.join(" ")}
        </ConfirmBox>
        <ConfirmBox name="confirmSunday" error={error("confirmSunday")}>
          {form.confirmSunday}
        </ConfirmBox>
        <ConfirmBox name="confirmRosary" error={error("confirmRosary")}>
          {form.confirmRosary}
        </ConfirmBox>
        <Checkbox name="joinAsStranger" defaultChecked size="15">
          {form.joinAsStranger}
        </Checkbox>
      </fieldset>

      <FormAlert message={formError} />
      <Button type="submit" variant="dark" block disabled={sending}>
        {sending ? common.sending : form.submit}
      </Button>
      <p className={styles.privacy}>
        {form.privacyNote}
        {SPACE}
        <SmartLink href={externalLinks.privacyPolicy}>{common.privacyLink}</SmartLink>
      </p>
    </form>
  );
}

/** A required confirmation box with its error under it. */
function ConfirmBox({ name, error, children }: { name: ApplicationField; error?: string; children: ReactNode }) {
  const errorId = useId();
  return (
    <div className={styles.confirmItem}>
      <Checkbox
        name={name}
        size="15"
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {children}
      </Checkbox>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
