import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { PathClose, PathSwitcher } from "@/widgets";
import { AmbitionSection } from "./sections/AmbitionSection";
import { ModelSection } from "./sections/ModelSection";
import { OpeningSection } from "./sections/OpeningSection";
import { QuestionsSection } from "./sections/QuestionsSection";
import { RosaryAndHabitSection } from "./sections/RosaryAndHabitSection";
import { YoukarisSection } from "./sections/YoukarisSection";

const { close, switcher } = strings.pray;

/** Pray, in the order of design-reference/pray.html. */
export function PrayView() {
  return (
    <>
      <OpeningSection />
      <ModelSection />
      <RosaryAndHabitSection />
      <AmbitionSection />
      <YoukarisSection />
      <QuestionsSection />
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
              { href: routes.give, photo: "giveEmbrace", ...switcher.give },
              { href: routes.gather, photo: "gatherWorshipCrowd", ...switcher.gather },
            ]}
          />
        }
      />
    </>
  );
}
