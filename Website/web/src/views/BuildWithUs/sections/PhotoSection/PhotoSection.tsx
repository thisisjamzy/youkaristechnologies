import { strings } from "@/content/strings";
import { Overlay, PhotoWithOverlay, Section } from "@/shared/ui";
import { PlacesBadge } from "@/widgets";

const { photo } = strings.buildWithUs;

export type PhotoSectionProps = { placesLeft: number | null };

export function PhotoSection({ placesLeft }: PhotoSectionProps) {
  return (
    <Section top="fluid-40-64">
      <PhotoWithOverlay name="buildTeam" alt={photo.photoAlt} height="team">
        {placesLeft !== null && (
          <Overlay position="bottomLeft">
            <PlacesBadge left={placesLeft} tone="white" />
          </Overlay>
        )}
      </PhotoWithOverlay>
    </Section>
  );
}
