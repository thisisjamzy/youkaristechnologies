import { strings } from "@/content/strings";
import { ApplyCoreTeamForm } from "@/features/apply-core-team";
import { PullLine, Section, type IconName } from "@/shared/ui";
import { JoinPanel } from "@/widgets";
import styles from "./FormSection.module.scss";

const { form } = strings.buildWithUs;
const icons: readonly IconName[] = ["pen", "clock", "heart"];

export type FormSectionProps = { placesLeft: number | null };

export function FormSection({ placesLeft }: FormSectionProps) {
  return (
    <Section top="sectionLarge" bottom="fluid-96-140" id="volunteer">
      <JoinPanel
        variant="apply"
        headline={form.headline}
        body={form.body}
        points={form.asks.map((title, i) => ({ title, icon: icons[i] }))}
      >
        <ApplyCoreTeamForm placesLeft={placesLeft} />
      </JoinPanel>
      <PullLine
        text={form.closing}
        tone="primary"
        secondTone="muted"
        size="fluid-26-40"
        align="center"
        className={styles.closing}
      />
    </Section>
  );
}
