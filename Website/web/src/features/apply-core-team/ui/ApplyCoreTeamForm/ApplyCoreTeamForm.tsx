"use client";

import { useState, type FormEvent } from "react";
import { strings } from "@/content/strings";
import { externalLinks } from "@/shared/lib";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormField,
  Heading,
  SmartLink,
  SuccessState,
  TextArea,
} from "@/shared/ui";
import styles from "./ApplyCoreTeamForm.module.scss";

const { form, teams, places } = strings.common;
const copy = strings.buildWithUs.form;
const SPACE = " ";

const teamOptions = Object.entries(teams).map(([value, team]) => ({ value, label: team.name }));

export type ApplyCoreTeamFormProps = {
  /** Core team places left, or null when unknown. 0 closes applications. */
  placesLeft: number | null;
};

/**
 * The Build With Us application, on the lime panel. Always an application; joining as a
 * stranger is an extra tick. Phase 8 adds validation and sending to /api/signup.
 */
export function ApplyCoreTeamForm({ placesLeft }: ApplyCoreTeamFormProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const teamFull = placesLeft !== null && placesLeft <= 0;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO(phase 8): validate with the shared zod schema and POST to /api/signup.
    setSent(true);
  };

  if (sent) {
    return (
      <SuccessState title={copy.success.title} tone="ink">
        <p className={styles.successText}>{copy.success.body}</p>
        <Heading as="p" text={form.passItOn} size="48" tracking="tighter" />
        <Button
          variant="outline"
          onClick={() => {
            setSent(false);
            setSelectedTeams([]);
          }}
        >
          {form.signUpSomeoneElse}
        </Button>
      </SuccessState>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <Heading as="h3" text={copy.title} size="fluid-28-38" leading="1-05" />
      <div className={styles.pair}>
        <FormField {...form.fullName} name="fullName" autoComplete="name" tone="onLime" required />
        <FormField {...form.baptismName} name="baptismName" tone="onLime" required />
      </div>
      <FormField {...form.email} name="email" type="email" autoComplete="email" tone="onLime" required />
      <div className={styles.pair}>
        <FormField {...form.parish} name="parish" tone="onLime" required />
        <FormField {...form.city} name="city" autoComplete="address-level2" tone="onLime" required />
      </div>
      <CheckboxGroup
        legend={copy.teamsLegend}
        name="teams"
        options={teamOptions}
        value={selectedTeams}
        onChange={setSelectedTeams}
        checkbox={{ align: "center", weight: "medium" }}
        disabled={teamFull}
      />
      <TextArea {...form.about} name="about" tone="onLime" />
      <Checkbox name="joinAsStranger" defaultChecked size="15">
        {copy.alsoJoin}
      </Checkbox>
      <Button type="submit" variant="dark" block disabled={teamFull}>
        {copy.submit}
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
