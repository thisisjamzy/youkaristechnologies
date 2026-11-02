import { Suspense } from "react";
import { strings } from "@/content/strings";
import { PullLine, Section } from "@/shared/ui";
import { ApplicationPanel } from "./ApplicationPanel";
import { ApplicationPanelFromUrl } from "./ApplicationPanelFromUrl";
import styles from "./ApplicationSection.module.scss";

const { application } = strings.roles;

export function ApplicationSection() {
  return (
    <Section top="section" bottom="fluid-96-140" id="apply">
      <Suspense fallback={<ApplicationPanel roleId={null} />}>
        <ApplicationPanelFromUrl />
      </Suspense>
      <PullLine
        text={application.closing}
        tone="primary"
        size="fluid-26-40"
        align="center"
        className={styles.closing}
      />
    </Section>
  );
}
