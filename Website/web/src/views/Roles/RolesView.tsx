import { ApplicationSection } from "./sections/ApplicationSection";
import { NatureSection } from "./sections/NatureSection";
import { OpeningSection } from "./sections/OpeningSection";
import { RolesSection } from "./sections/RolesSection";
import { WhoWeLookForSection } from "./sections/WhoWeLookForSection";

/** Volunteer roles, in the order of design-reference/roles.html. */
export function RolesView() {
  return (
    <>
      <OpeningSection />
      <NatureSection />
      <WhoWeLookForSection />
      <RolesSection />
      <ApplicationSection />
    </>
  );
}
