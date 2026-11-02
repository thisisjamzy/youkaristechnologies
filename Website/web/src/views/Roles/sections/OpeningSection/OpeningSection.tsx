import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, FolderCard, Heading, Label, Section, SmartLink, Tag, Text } from "@/shared/ui";
import styles from "./OpeningSection.module.scss";

const { opening } = strings.roles;

export function OpeningSection() {
  return (
    <Section top="opening" className={styles.section}>
      <div className={styles.copy}>
        <SmartLink href={routes.volunteer} className={styles.tagLink}>
          <Tag bordered>{opening.tag}</Tag>
        </SmartLink>
        <Heading as="h1" text={opening.headline} size="displayXl" tracking="tightPlus" />
        <Text variant="lead" leading="1-65" measure="640">
          {opening.body}
        </Text>
        <Button href="#roles" arrow="right" className={styles.cta}>
          {opening.cta}
        </Button>
      </div>
      <div className={styles.cardColumn}>
        <FolderCard tone="lime" tab="wide" tabHeight="lg" bodyClassName={styles.card}>
          <Label tone="inherit">{opening.card.label}</Label>
          <Heading as="b" text={opening.card.title} size="30" leading="1-05" tracking="snug" />
          <span className={styles.text}>{opening.card.text}</span>
          <SmartLink href="#nature" className={styles.cardLink}>
            {opening.card.link}
          </SmartLink>
        </FolderCard>
      </div>
    </Section>
  );
}
