"use client";

import { useState, type FormEvent } from "react";
import { strings } from "@/content/strings";
import { externalLinks, whatsAppShareUrl } from "@/shared/lib";
import { Button, Checkbox, CheckboxGroup, FormField, Heading, SmartLink, SuccessState, TextArea } from "@/shared/ui";
import styles from "./JoinNetworkForm.module.scss";

const { form, teams, places, share } = strings.common;
const { join } = strings.home;
const SPACE = " ";

const teamOptions = Object.entries(teams).map(([value, team]) => ({ value, label: team.name }));

export type JoinNetworkFormProps = {
  /** Core team places left, or null when unknown. 0 closes the core team option. */
  placesLeft: number | null;
};

/**
 * The Home sign-up form: join as a stranger and, optionally, apply for the core team.
 * Phase 8 adds validation and sending to /api/signup; until then submitting only shows
 * the success state.
 */
export function JoinNetworkForm({ placesLeft }: JoinNetworkFormProps) {
  const [applying, setApplying] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const teamFull = placesLeft !== null && placesLeft <= 0;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO(phase 8): validate with the shared zod schema and POST to /api/signup.
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setApplying(false);
    setSelectedTeams([]);
  };

  if (sent) {
    return (
      <SuccessState title={join.success.title}>
        <p className={styles.successText}>{join.success.body}</p>
        <p className={styles.successPrompt}>{join.success.prompt}</p>
        <Heading as="p" text={form.passItOn} size="56" tracking="tighter" />
        <div className={styles.actions}>
          <Button href={whatsAppShareUrl(share.afterSignup)}>{form.shareOnWhatsApp}</Button>
          <Button variant="light" onClick={reset}>
            {form.signUpSomeoneElse}
          </Button>
        </div>
      </SuccessState>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <div className={styles.pair}>
        <FormField {...form.fullName} name="fullName" autoComplete="name" required />
        <FormField {...form.baptismName} name="baptismName" required />
      </div>
      <FormField {...form.email} name="email" type="email" autoComplete="email" required />
      <div className={styles.pair}>
        <FormField {...form.parish} name="parish" required />
        <FormField {...form.city} name="city" autoComplete="address-level2" required />
      </div>
      <FormField {...form.whatsApp} name="whatsApp" type="tel" autoComplete="tel" />

      <fieldset className={styles.choices}>
        <legend className={styles.legend}>{join.form.choiceLegend}</legend>
        <div className={styles.choiceGrid}>
          <Checkbox name="joinAsStranger" defaultChecked>
            <b>{join.form.joinAsStranger.label}</b>
            {SPACE}
            {join.form.joinAsStranger.hint}
          </Checkbox>
          <Checkbox
            name="applyCoreTeam"
            checked={applying}
            disabled={teamFull}
            onChange={(e) => setApplying(e.target.checked)}
          >
            <b>{join.form.applyCoreTeam.label}</b>
            {SPACE}
            {join.form.applyCoreTeam.hint}
          </Checkbox>
        </div>
        {teamFull && <p className={styles.note}>{places.complete}</p>}
      </fieldset>

      {applying && !teamFull && (
        <div className={styles.coreTeam}>
          <p className={styles.note}>
            {placesLeft !== null && (
              <>
                <b className={styles.places}>{places.sentence(placesLeft)}</b>
                {SPACE}
              </>
            )}
            {form.interviewNote}
          </p>
          <CheckboxGroup
            legend={join.form.teamsLegend}
            name="teams"
            options={teamOptions}
            value={selectedTeams}
            onChange={setSelectedTeams}
            gap={2.5}
          />
          <TextArea {...form.about} name="about" />
        </div>
      )}

      <Button type="submit" variant="dark" block>
        {join.form.submit}
      </Button>
      <p className={styles.privacy}>
        {form.privacyNote}
        {SPACE}
        <SmartLink href={externalLinks.privacyPolicy}>{form.privacyLink}</SmartLink>
      </p>
    </form>
  );
}
