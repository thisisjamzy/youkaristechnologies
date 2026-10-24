import { strings } from "@/content/strings";
import { Chip, Heading, Overlay, PhotoWithOverlay, Text } from "@/shared/ui";
import media from "../_media/media.module.scss";
import { StoryChapter } from "../StoryChapter";

const { whatWeSaw } = strings.ourStory;

export function WhatWeSawSection() {
  return (
    <StoryChapter index={1} label={whatWeSaw.label}>
      <Heading text={whatWeSaw.headline} size="fluid-30-48" leading="1-06" measure="760" />
      {whatWeSaw.body.map((paragraph) => (
        <Text key={paragraph} variant="longform" measure="680">
          {paragraph}
        </Text>
      ))}
      <div className={`${media.media} ${media.pair}`}>
        <PhotoWithOverlay name="massAltar" alt={whatWeSaw.sunday.photoAlt} height="chapterPair" radius="lg" sizes="third">
          <Overlay position="topLeft" inset={3.5}>
            <Chip size="sm">{whatWeSaw.sunday.caption}</Chip>
          </Overlay>
        </PhotoWithOverlay>
        <PhotoWithOverlay
          name="eventLaugh"
          alt={whatWeSaw.monday.photoAlt}
          height="chapterPair"
          radius="lg"
          focus="30"
          sizes="third"
        >
          <Overlay position="topLeft" inset={3.5}>
            <Chip size="sm" tone="ink">
              {whatWeSaw.monday.caption}
            </Chip>
          </Overlay>
        </PhotoWithOverlay>
      </div>
    </StoryChapter>
  );
}
