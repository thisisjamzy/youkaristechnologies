import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, Section, StatementBlock } from "@/shared/ui";
import { PathClose, PathSwitcher } from "@/widgets";
import { HowOftenSection } from "./sections/HowOftenSection";
import { OpeningSection } from "./sections/OpeningSection";
import { RoomOfPaulsSection } from "./sections/RoomOfPaulsSection";
import { WhatHappensSection } from "./sections/WhatHappensSection";
import { WhyWeGatherSection } from "./sections/WhyWeGatherSection";

const { lookForward, close, switcher } = strings.gather;

/** Gather, in the order of design-reference/gather.html. */
export function GatherView() {
  return (
    <>
      <OpeningSection />
      <RoomOfPaulsSection />
      <WhatHappensSection />
      <WhyWeGatherSection />
      <HowOftenSection />
      <Section top="sectionLarge">
        <StatementBlock {...lookForward} headingMeasure="960" bodyMeasure="660" />
      </Section>
      <PathClose
        headline={close.headline}
        body={close.body}
        actions={
          <Button href={routes.join} arrow="right">
            {close.cta}
          </Button>
        }
        switcher={
          <PathSwitcher
            items={[
              { href: routes.pray, photo: "prayHandsRaised", ...switcher.pray },
              { href: routes.give, photo: "giveEmbrace", ...switcher.give },
            ]}
          />
        }
      />
    </>
  );
}
