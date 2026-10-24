import { strings } from "@/content/strings";
import type { PhotoName } from "@/shared/lib";
import { Heading, PhotoMosaic, Section, Tag, type MosaicTile } from "@/shared/ui";
import styles from "./WhatHappensSection.module.scss";

const { whatHappens } = strings.gather;

// Photos for the photo tiles, in order, as in the reference.
const photos: { name: PhotoName; focus?: "40" }[] = [
  { name: "gatherWorship" },
  { name: "gatherTable" },
  { name: "gatherChurch" },
  { name: "gatherTalking", focus: "40" },
];
// The last text tile is the one lime tile, as in the reference.
const limeIndex = whatHappens.tiles.findLastIndex((tile) => tile.kind === "text");

const tiles: MosaicTile[] = (() => {
  let next = 0;
  return whatHappens.tiles.map((tile, i) =>
    tile.kind === "photo"
      ? { kind: "photo", alt: tile.alt, ...photos[next++] }
      : { kind: "text", title: tile.title, text: tile.text, tone: i === limeIndex ? "lime" : "white" },
  );
})();

export function WhatHappensSection() {
  return (
    <Section top="section">
      <div className={styles.header}>
        <Tag bordered>{whatHappens.label}</Tag>
        <Heading text={whatHappens.headline} size="headingL" leading="1-02" />
      </div>
      <PhotoMosaic tiles={tiles} />
    </Section>
  );
}
