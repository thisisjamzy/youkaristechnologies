"use client";

import { useEffect, useId, useRef, type FormEvent } from "react";
import { strings } from "@/content/strings";
import { LIMITS, signupSchema, type SignupField } from "@/entities/signup";
import { useSignupSubmission } from "@/entities/signup/client";
import { externalLinks, routes, whatsAppShareUrl } from "@/shared/lib";
import { Button, Checkbox, FormAlert, FormField, Heading, Honeypot, SmartLink, SuccessState } from "@/shared/ui";
import styles from "./JoinNetworkForm.module.scss";

const { form, share } = strings.common;
const { join } = strings.home;
const SPACE = " ";
// A controlled box with a no-op handler: React puts the tick straight back.
const keepTicked = () => {};

/** The Home sign-up form: join the network as a stranger. Volunteers apply per role on the Roles page. */
export function JoinNetworkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successId = useId();
  const { status, errors, formError, submit } = useSignupSubmission(signupSchema);

  useEffect(() => {
    if (status === "sent") document.getElementById(successId)?.focus();
  }, [status, successId]);

  const focusField = (field: SignupField) => {
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");
    const firstInvalid = await submit({
      sourcePage: "home",
      baptismName: text("baptismName"),
      phone: text("phone"),
      parish: text("parish"),
      city: text("city"),
      email: text("email"),
      joinAsStranger: true,
      website: text("website"),
    });
    if (firstInvalid) focusField(firstInvalid);
  };

  if (status === "sent") {
    return (
      <SuccessState title={join.success.title} titleId={successId}>
        <p className={styles.successText}>{join.success.body}</p>
        <p className={styles.successPrompt}>{join.success.prompt}</p>
        <Heading as="p" text={form.passItOn} size="56" tracking="tighter" />
        <div className={styles.actions}>
          <Button href={whatsAppShareUrl(share.afterSignup)}>{form.shareOnWhatsApp}</Button>
        </div>
      </SuccessState>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={styles.form} aria-busy={sending}>
      <Honeypot />
      <div className={styles.pair}>
        <FormField
          {...form.baptismName}
          name="baptismName"
          maxLength={LIMITS.name}
          required
          error={errors.baptismName}
        />
        <FormField
          {...form.phone}
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          required
          error={errors.phone}
        />
      </div>
      <div className={styles.pair}>
        <FormField {...form.parish} name="parish" maxLength={LIMITS.place} required error={errors.parish} />
        <FormField
          {...form.city}
          name="city"
          autoComplete="address-level2"
          maxLength={LIMITS.place}
          required
          error={errors.city}
        />
      </div>
      <FormField
        {...form.email}
        labelHint={form.optional}
        name="email"
        type="email"
        autoComplete="email"
        maxLength={LIMITS.email}
        error={errors.email}
      />

      <fieldset className={styles.choices}>
        <legend className={styles.legend}>{join.form.choiceLegend}</legend>
        {/* Joining as a stranger is what this form does, so the box stays ticked. */}
        <Checkbox name="joinAsStranger" checked onChange={keepTicked}>
          <b>{join.form.joinAsStranger.label}</b>
          {SPACE}
          {join.form.joinAsStranger.hint}
        </Checkbox>
      </fieldset>

      <p className={styles.note}>
        {join.form.volunteer.text}
        {SPACE}
        <SmartLink href={routes.roles} className={styles.noteLink}>
          {join.form.volunteer.link}
        </SmartLink>
      </p>

      <FormAlert message={formError} />
      <Button type="submit" variant="dark" block disabled={sending}>
        {sending ? form.sending : join.form.submit}
      </Button>
      <p className={styles.privacy}>
        {form.privacyNote}
        {SPACE}
        <SmartLink href={externalLinks.privacyPolicy}>{form.privacyLink}</SmartLink>
      </p>
    </form>
  );
}
