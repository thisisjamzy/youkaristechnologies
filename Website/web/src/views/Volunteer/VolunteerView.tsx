import { FourTeamsSection } from "./sections/FourTeamsSection";
import { HowToVolunteerSection } from "./sections/HowToVolunteerSection";
import { OpeningSection } from "./sections/OpeningSection";
import { PhotoSection } from "./sections/PhotoSection";
import { WhyVolunteerSection } from "./sections/WhyVolunteerSection";

/** Volunteer, in the order of design-reference/volunteer.html. */
export function VolunteerView() {
  return (
    <>
      <OpeningSection />
      <PhotoSection />
      <WhyVolunteerSection />
      <FourTeamsSection />
      <HowToVolunteerSection />
    </>
  );
}
