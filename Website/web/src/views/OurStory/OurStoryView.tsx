import { CloseSection } from "./sections/CloseSection";
import { NameAndMarkSection } from "./sections/NameAndMarkSection";
import { OpeningSection } from "./sections/OpeningSection";
import { TenFriendsSection } from "./sections/TenFriendsSection";
import { WhatWeKnewSection } from "./sections/WhatWeKnewSection";
import { WhatWeSawSection } from "./sections/WhatWeSawSection";
import { WhenItBrokeSection } from "./sections/WhenItBrokeSection";
import { WhyWeAreBackSection } from "./sections/WhyWeAreBackSection";

/** Our Story, in the order of design-reference/our-story.html. */
export function OurStoryView() {
  return (
    <>
      <OpeningSection />
      <WhatWeSawSection />
      <WhatWeKnewSection />
      <TenFriendsSection />
      <WhenItBrokeSection />
      <WhyWeAreBackSection />
      <NameAndMarkSection />
      <CloseSection />
    </>
  );
}
