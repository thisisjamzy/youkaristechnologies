import { strings } from "@/content/strings";
import { Chip, Icon, OpeningIntro, Overlay, PhotoWithOverlay, Section, Tag } from "@/shared/ui";

const { opening } = strings.give;

export function OpeningSection() {
  return (
    <Section top="opening">
      <OpeningIntro tag={<Tag variant="blue">{opening.label}</Tag>} headline={opening.headline} lead={opening.body}>
        <PhotoWithOverlay name="giveOutreach" alt={opening.photoAlt} height="feature" priority>
          <Overlay position="bottomLeft">
            <Chip icon={<Icon name="check" size="sm" stroke="heavy" />}>{opening.photoChip}</Chip>
          </Overlay>
        </PhotoWithOverlay>
      </OpeningIntro>
    </Section>
  );
}
