import { strings } from "@/content/strings";
import { Heading, Photo, Text } from "@/shared/ui";
import media from "../_media/media.module.scss";
import { StoryChapter } from "../StoryChapter";

const { whatWeKnew } = strings.ourStory;

export function WhatWeKnewSection() {
  return (
    <StoryChapter index={2} label={whatWeKnew.label}>
      <Heading
        text={whatWeKnew.pullQuote}
        size="fluid-30-48"
        leading="1-06"
        measure="760"
        secondTone="highlightSoft"
      />
      <Text variant="longform" measure="680">
        {whatWeKnew.body}
      </Text>
      <Photo
        name="bwRosaryHands"
        alt={whatWeKnew.photoAlt}
        height="chapterWide"
        radius="lg"
        sizes="half"
        className={media.media}
      />
    </StoryChapter>
  );
}
