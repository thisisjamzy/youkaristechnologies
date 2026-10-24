import { strings } from "@/content/strings";
import { Heading, Photo, Text } from "@/shared/ui";
import media from "../_media/media.module.scss";
import { StoryChapter } from "../StoryChapter";

const { whyWeAreBack } = strings.ourStory;

export function WhyWeAreBackSection() {
  return (
    <StoryChapter index={5} label={whyWeAreBack.label}>
      <Heading text={whyWeAreBack.headline} size="fluid-30-48" leading="1-06" measure="760" />
      <Text variant="longform" measure="680">
        {whyWeAreBack.body}
      </Text>
      <Photo
        name="storyPrayingRoom"
        alt={whyWeAreBack.photoAlt}
        height="chapterWide"
        radius="lg"
        focus="40"
        sizes="half"
        className={media.media}
      />
    </StoryChapter>
  );
}
