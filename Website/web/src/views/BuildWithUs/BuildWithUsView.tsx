import { strings } from "@/content/strings";
import { Section, StatementBlock } from "@/shared/ui";
import { FormSection } from "./sections/FormSection";
import { FourTeamsSection } from "./sections/FourTeamsSection";
import { OpeningSection } from "./sections/OpeningSection";
import { PhotoSection } from "./sections/PhotoSection";
import { TwentyPlacesSection } from "./sections/TwentyPlacesSection";

export type BuildWithUsViewProps = {
  /** Core team places left. Phase 8 reads it from the backend; null hides the number. */
  placesLeft: number | null;
};

/** Build With Us, in the order of design-reference/build-with-us.html. */
export function BuildWithUsView({ placesLeft }: BuildWithUsViewProps) {
  return (
    <>
      <OpeningSection placesLeft={placesLeft} />
      <PhotoSection placesLeft={placesLeft} />
      <TwentyPlacesSection placesLeft={placesLeft} />
      <Section top="sectionLarge">
        <StatementBlock {...strings.buildWithUs.whyNow} gap="md" headingMeasure="940" bodyMeasure="660" />
      </Section>
      <FourTeamsSection />
      <FormSection placesLeft={placesLeft} />
    </>
  );
}
