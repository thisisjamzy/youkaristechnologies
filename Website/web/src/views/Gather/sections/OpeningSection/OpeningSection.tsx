import { strings } from "@/content/strings";
import { OpeningIntro, Overlay, PhotoWithOverlay, Section, Tag } from "@/shared/ui";

const { opening } = strings.gather;

export function OpeningSection() {
  return (
    <Section top="opening">
      <OpeningIntro tag={<Tag variant="ink">{opening.label}</Tag>} headline={opening.headline} lead={opening.body}>
        <PhotoWithOverlay name="gatherCrowd" alt={opening.photoAlt} height="hero" priority>
          <Overlay position="topLeft">
            <Tag variant="lime" size="lg">
              {opening.photoLabel}
            </Tag>
          </Overlay>
        </PhotoWithOverlay>
      </OpeningIntro>
    </Section>
  );
}
