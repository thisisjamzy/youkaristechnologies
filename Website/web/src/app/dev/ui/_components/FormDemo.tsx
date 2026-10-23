"use client";

import { useState } from "react";
import { strings } from "@/content/strings";
import { Button, Checkbox, CheckboxGroup, FormField, Stack, SuccessState, Text, TextArea } from "@/shared/ui";
import styles from "./UiShowcase.module.scss";

const { form, errors, teams } = strings.common;
const teamOptions = Object.entries(teams).map(([value, team]) => ({ value, label: team.name }));

/** Interactive form pieces: tick teams, toggle errors, show the success state. */
export function FormDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className={styles.formPanel}>
        <SuccessState title={strings.home.join.success.title}>
          <Text size="17">{strings.home.join.success.body}</Text>
          <Stack direction="row" gap={2.5} wrap>
            <Button href="https://wa.me/">{form.shareOnWhatsApp}</Button>
            <Button variant="light" onClick={() => setSent(false)}>
              {form.signUpSomeoneElse}
            </Button>
          </Stack>
        </SuccessState>
      </div>
    );
  }

  return (
    <div className={styles.formPanel}>
      <Stack gap={5.5}>
        <div className={styles.twoCol}>
          <FormField
            {...form.fullName}
            name="fullName"
            autoComplete="name"
            error={showErrors ? errors.fullNameMissing : undefined}
          />
          <FormField {...form.baptismName} name="baptismName" />
        </div>
        <FormField
          {...form.email}
          name="email"
          type="email"
          error={showErrors ? errors.emailInvalid : undefined}
        />
        <Checkbox defaultChecked>
          <b>{strings.home.join.form.joinAsStranger.label}</b> {strings.home.join.form.joinAsStranger.hint}
        </Checkbox>
        <CheckboxGroup
          legend={strings.home.join.form.teamsLegend}
          name="team"
          options={teamOptions}
          value={selected}
          onChange={setSelected}
          gap={2.5}
          error={showErrors ? errors.noChoice : undefined}
        />
        <TextArea {...form.about} name="about" />
        <Button variant="dark" block onClick={() => setSent(true)}>
          {strings.home.join.form.submit}
        </Button>
        <Button variant="outline" onClick={() => setShowErrors((v) => !v)}>
          Toggle errors
        </Button>
      </Stack>
    </div>
  );
}
