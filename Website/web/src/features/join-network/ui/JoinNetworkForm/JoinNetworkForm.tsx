"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { strings } from "@/content/strings";
import { createSignupSchema, LIMITS, type SignupField } from "@/entities/signup";
import { useSignupSubmission } from "@/entities/signup/client";
import { teamIds } from "@/entities/team";
import { externalLinks, whatsAppShareUrl } from "@/shared/lib";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormAlert,
  FormField,
  Heading,
  Honeypot,
  SmartLink,
  SuccessState,
  TextArea,
} from "@/shared/ui";
import styles from "./JoinNetworkForm.module.scss";

const { form, teams, share } = strings.common;
const { join } = strings.home;
const SPACE = " ";

const schema = createSignupSchema(teamIds);
const teamOptions = teamIds.map((id) => ({ value: id, label: teams[id].name }));

/** The Home sign-up form: join as a stranger and, optionally, apply for the core team. */
export function JoinNetworkForm() {
  const [joining, setJoining] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const successId = useId();
  const { status, errors, formError, submit } = useSignupSubmission(schema);

  useEffect(() => {
    if (status === "sent") document.getElementById(successId)?.focus();
  }, [status, successId]);

  const focusField = (field: SignupField) => {
    const name = field === "choice" ? "joinAsStranger" : field;
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");
    const firstInvalid = await submit({
      sourcePage: "home",
      fullName: text("fullName"),
      baptismName: text("baptismName"),
      email: text("email"),
      parish: text("parish"),
      city: text("city"),
      whatsApp: text("whatsApp"),
      joinAsStranger: joining,
      applyCoreTeam: applying,
      teams: applying ? selectedTeams : [],
      about: applying ? text("about") : "",
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
          {...form.fullName}
          name="fullName"
          autoComplete="name"
          maxLength={LIMITS.name}
          required
          error={errors.fullName}
        />
        <FormField
          {...form.baptismName}
          name="baptismName"
          maxLength={LIMITS.name}
          required
          error={errors.baptismName}
        />
      </div>
      <FormField
        {...form.email}
        name="email"
        type="email"
        autoComplete="email"
        maxLength={LIMITS.email}
        required
        error={errors.email}
      />
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
        {...form.whatsApp}
        name="whatsApp"
        type="tel"
        autoComplete="tel"
        maxLength={LIMITS.whatsApp}
        error={errors.whatsApp}
      />

      <fieldset className={styles.choices} aria-describedby={errors.choice ? `${successId}-choice` : undefined}>
        <legend className={styles.legend}>{join.form.choiceLegend}</legend>
        <div className={styles.choiceGrid}>
          <Checkbox name="joinAsStranger" checked={joining} onChange={(e) => setJoining(e.target.checked)}>
            <b>{join.form.joinAsStranger.label}</b>
            {SPACE}
            {join.form.joinAsStranger.hint}
          </Checkbox>
          <Checkbox
            name="applyCoreTeam"
            checked={applying}
            onChange={(e) => setApplying(e.target.checked)}
          >
            <b>{join.form.applyCoreTeam.label}</b>
            {SPACE}
            {join.form.applyCoreTeam.hint}
          </Checkbox>
        </div>
        {errors.choice && (
          <p id={`${successId}-choice`} className={styles.error}>
            {errors.choice}
          </p>
        )}
      </fieldset>

      {applying && (
        <div className={styles.coreTeam}>
          <p className={styles.note}>{form.interviewNote}</p>
          <CheckboxGroup
            legend={join.form.teamsLegend}
            name="teams"
            options={teamOptions}
            value={selectedTeams}
            onChange={setSelectedTeams}
            gap={2.5}
            error={errors.teams}
          />
          <TextArea {...form.about} name="about" maxLength={LIMITS.about} error={errors.about} />
        </div>
      )}

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
