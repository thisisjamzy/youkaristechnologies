import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { ArrowLink, Button, Section, StatementBlock } from "@/shared/ui";
import { PathClose, PathSwitcher } from "@/widgets";
import { GiftTravelsSection } from "./sections/GiftTravelsSection";
import { OpeningSection } from "./sections/OpeningSection";
import { WhoWeGiveToSection } from "./sections/WhoWeGiveToSection";
import { WorkedForSection } from "./sections/WorkedForSection";

const { ambition, close, switcher } = strings.give;

/** Give, in the order of design-reference/give.html. */
export function GiveView() {
  return (
    <>
      <OpeningSection />
      <WorkedForSection />
      <GiftTravelsSection />
      <WhoWeGiveToSection />
      <Section top="sectionLarge">
        <StatementBlock {...ambition} headingMeasure="980" bodyMeasure="660" />
      </Section>
      <PathClose
        headline={close.headline}
        body={close.body}
        bodyMeasure="600"
        actions={
          <>
            <Button href={routes.join} arrow="right">
              {close.cta}
            </Button>
            <ArrowLink href={routes.buildWithUs} arrow={false}>
              {close.secondaryCta}
            </ArrowLink>
          </>
        }
        switcher={
          <PathSwitcher
            items={[
              { href: routes.pray, photo: "prayOpenHands", ...switcher.pray },
              { href: routes.gather, photo: "gatherCrowd", ...switcher.gather },
            ]}
          />
        }
      />
    </>
  );
}
