import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { ArrowLink, Heading, NumberCard, Photo, PullLine, Section, Text } from "@/shared/ui";
import cards from "../_shared/cards.module.scss";

const { pray } = strings.home;

export function PraySection() {
  return (
    <Section top="section" id="pray">
      <div className={cards.grid}>
        <Photo name="passRosary" alt={pray.photoAlt} height="fill" minHeight={100} radius="xl" sizes="third" />
        <div className={cards.card}>
          <Heading text={pray.headline} size="44" />
          <Text className={cards.grow}>{pray.body}</Text>
          <ArrowLink href={routes.pray}>{pray.link}</ArrowLink>
        </div>
        <NumberCard {...pray.numberCard} tone="lime" size="lg" />
      </div>
      <PullLine text={pray.photoCard} align="center" className={cards.pullLine} />
    </Section>
  );
}
