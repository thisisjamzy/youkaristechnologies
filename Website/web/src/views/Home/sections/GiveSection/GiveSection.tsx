import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { ArrowLink, Heading, Photo, PullLine, Section, Tag, Text } from "@/shared/ui";
import cards from "../_shared/cards.module.scss";
import styles from "./GiveSection.module.scss";

const { give } = strings.home;

export function GiveSection() {
  return (
    <Section top="fluid-80-128" id="give">
      <div className={cards.grid}>
        <div className={cards.card}>
          <Heading text={give.headline} size="44" />
          <Text className={cards.grow}>{give.body}</Text>
          <ArrowLink href={routes.give}>{give.link}</ArrowLink>
        </div>
        <Photo name="giveEmbrace" alt={give.photoAlt} height="fill" minHeight={95} radius="xl" sizes="third" />
        <div className={`${cards.card} ${styles.smallActs}`}>
          <Tag variant="lime">{give.card.label}</Tag>
          <Heading as="p" text={give.card.line} size="44" secondTone="muted" />
        </div>
      </div>
      <PullLine text={give.pullLine} align="center" className={cards.pullLine} />
    </Section>
  );
}
