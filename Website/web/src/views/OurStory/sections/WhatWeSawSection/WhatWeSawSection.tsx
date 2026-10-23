import { strings } from "@/content/strings";
import { Chip, Grid, Heading, Label, Overlay, PhotoWithOverlay, Section, Text } from "@/shared/ui";
import reading from "../_shared/reading.module.scss";

const { whatWeSaw } = strings.ourStory;

export function WhatWeSawSection() {
  return (
    <>
      <Section as="article" width="reading" top="fluid-80-128" className={reading.column}>
        <Label>{whatWeSaw.label}</Label>
        <Heading text={whatWeSaw.headline} size="fluid-30-44" leading="1-08" />
        {whatWeSaw.body.map((paragraph) => (
          <Text key={paragraph} variant="longform">
            {paragraph}
          </Text>
        ))}
      </Section>
      <Section top={14}>
        <Grid min={75} gap={3}>
          <PhotoWithOverlay name="massAltar" alt={whatWeSaw.sunday.photoAlt} height={105} radius="lg" sizes="half">
            <Overlay position="topLeft" inset={4}>
              <Chip size="sm">{whatWeSaw.sunday.caption}</Chip>
            </Overlay>
          </PhotoWithOverlay>
          <PhotoWithOverlay
            name="eventLaugh"
            alt={whatWeSaw.monday.photoAlt}
            height={105}
            radius="lg"
            focus="30"
            sizes="half"
          >
            <Overlay position="topLeft" inset={4}>
              <Chip size="sm" tone="ink">
                {whatWeSaw.monday.caption}
              </Chip>
            </Overlay>
          </PhotoWithOverlay>
        </Grid>
      </Section>
    </>
  );
}
