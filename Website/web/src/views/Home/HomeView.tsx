import { AmbitionSection } from "./sections/AmbitionSection";
import { BuildBandSection } from "./sections/BuildBandSection";
import { ChallengeSection } from "./sections/ChallengeSection";
import { DifferenceSection } from "./sections/DifferenceSection";
import { GatherSection } from "./sections/GatherSection";
import { GiveSection } from "./sections/GiveSection";
import { JoinSection } from "./sections/JoinSection";
import { OpeningSection } from "./sections/OpeningSection";
import { PraySection } from "./sections/PraySection";
import { StrangersInPrayerSection } from "./sections/StrangersInPrayerSection";
import { WhoWeAreSection } from "./sections/WhoWeAreSection";
import { WhyStrangersSection } from "./sections/WhyStrangersSection";

/** Home, section by section in the order of design-reference/home.html. */
export function HomeView() {
  return (
    <>
      <OpeningSection />
      <ChallengeSection />
      <WhoWeAreSection />
      <StrangersInPrayerSection />
      <DifferenceSection />
      <PraySection />
      <GiveSection />
      <GatherSection />
      <WhyStrangersSection />
      <AmbitionSection />
      <BuildBandSection />
      <JoinSection />
    </>
  );
}
