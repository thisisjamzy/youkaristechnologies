"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { strings } from "@/content/strings";
import { createSignupSchema, LIMITS, type SignupField } from "@/entities/signup";
import { useSignupSubmission } from "@/entities/signup/client";
import { teamIds } from "@/entities/team";
import { externalLinks } from "@/shared/lib";
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
import styles from "./ApplyCoreTeamForm.module.scss";

const { form, teams, places, errors: errorCopy } = strings.common;
const copy = strings.buildWithUs.form;
const SPACE = " ";

const schema = createSignupSchema(teamIds);
const teamOptions = teamIds.map((id) => ({ value: id, label: teams[id].name }));

export type ApplyCoreTeamFormProps = {
  /** Core team places left, or null when unknown. 0 closes applications. */
  placesLeft: number | null;
};

/**
 * The Build With Us application, on the lime panel. Always an application; joining as a
 * stranger is an extra tick.
 */
export function ApplyCoreTeamForm({ placesLeft }: ApplyCoreTeamFormProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [joining, setJoining] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const successId = useId();
  const { status, errors, formError, coreTeamFull, submit } = useSignupSubmission(schema);
  const teamFull = (placesLeft !== null && placesLeft <= 0) || coreTeamFull;

  useEffect(() => {
    if (status === "sent" && !coreTeamFull) document.getElementById(successId)?.focus();
  }, [status, coreTeamFull, successId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");
    const firstInvalid: SignupField | null = await submit({
      sourcePage: "build-with-us",
      fullName: text("fullName"),
      baptismName: text("baptismName"),
      email: text("email"),
      parish: text("parish"),
      city: text("city"),
      joinAsStranger: joining,
      applyCoreTeam: true,
      teams: selectedTeams,
      about: text("about"),
      website: text("website"),
    });
    if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
  };

  // The success copy promises someone will be in touch, so a full team is not a success here:
  // the person is saved as a stranger and told the places are taken.
  if (status === "sent" && !coreTeamFull) {
    return (
      <SuccessState title={copy.success.title} tone="ink" titleId={successId}>
        <p className={styles.successText}>{copy.success.body}</p>
        <Heading as="p" text={form.passItOn} size="48" tracking="tighter" />
      </SuccessState>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={styles.form} aria-busy={sending}>
      <Honeypot />
      <Heading as="h3" text={copy.title} size="fluid-28-38" leading="1-05" />
      <div className={styles.pair}>
        <FormField
          {...form.fullName}
          name="fullName"
          autoComplete="name"
          tone="onLime"
          maxLength={LIMITS.name}
          required
          error={errors.fullName}
        />
        <FormField
          {...form.baptismName}
          name="baptismName"
          tone="onLime"
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
        tone="onLime"
        maxLength={LIMITS.email}
        required
        error={errors.email}
      />
      <div className={styles.pair}>
        <FormField
          {...form.parish}
          name="parish"
          tone="onLime"
          maxLength={LIMITS.place}
          required
          error={errors.parish}
        />
        <FormField
          {...form.city}
          name="city"
          autoComplete="address-level2"
          tone="onLime"
          maxLength={LIMITS.place}
          required
          error={errors.city}
        />
      </div>
      <CheckboxGroup
        legend={copy.teamsLegend}
        name="teams"
        options={teamOptions}
        value={selectedTeams}
        onChange={setSelectedTeams}
        checkbox={{ align: "center", weight: "medium" }}
        disabled={teamFull}
        error={errors.teams}
      />
      <TextArea {...form.about} name="about" tone="onLime" maxLength={LIMITS.about} error={errors.about} />
      <Checkbox name="joinAsStranger" checked={joining} onChange={(e) => setJoining(e.target.checked)} size="15">
        {copy.alsoJoin}
      </Checkbox>
      <FormAlert message={coreTeamFull ? errorCopy.applicationsClosed : formError} />
      <Button type="submit" variant="dark" block disabled={teamFull || sending}>
        {sending ? form.sending : copy.submit}
      </Button>
      <p className={styles.places}>
        {teamFull
          ? places.complete
          : placesLeft !== null
            ? places.sentenceWithInterview(placesLeft)
            : form.interviewNote}
      </p>
      <p className={styles.privacy}>
        {form.privacyNote}
        {SPACE}
        <SmartLink href={externalLinks.privacyPolicy} className={styles.privacyLink}>
          {form.privacyLink}
        </SmartLink>
      </p>
    </form>
  );
}
