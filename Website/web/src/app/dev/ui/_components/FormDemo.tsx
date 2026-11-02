"use client";

import { useState } from "react";
import { strings } from "@/content/strings";
import { Button, Checkbox, FormField, Stack, SuccessState, Text } from "@/shared/ui";
import styles from "./UiShowcase.module.scss";

const { form, errors } = strings.common;

/** Interactive form pieces: toggle errors, show the success state. */
export function FormDemo() {
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div>
        <SuccessState title={strings.home.join.success.title}>
          <Text size="17">{strings.home.join.success.body}</Text>
          <Stack direction="row" gap={2.5} wrap>
            <Button href="https://wa.me/">{form.shareOnWhatsApp}</Button>
          </Stack>
        </SuccessState>
      </div>
    );
  }

  return (
    <div>
      <Stack gap={5.5}>
        <div className={styles.twoCol}>
          <FormField
            {...form.baptismName}
            name="baptismName"
            error={showErrors ? errors.baptismNameMissing : undefined}
          />
          <FormField
            {...form.phone}
            name="phone"
            type="tel"
            error={showErrors ? errors.phoneInvalid : undefined}
          />
        </div>
        <FormField
          {...form.email}
          labelHint={form.optional}
          name="email"
          type="email"
          error={showErrors ? errors.emailInvalid : undefined}
        />
        <Checkbox defaultChecked>
          <b>{strings.home.join.form.joinAsStranger.label}</b> {strings.home.join.form.joinAsStranger.hint}
        </Checkbox>
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
