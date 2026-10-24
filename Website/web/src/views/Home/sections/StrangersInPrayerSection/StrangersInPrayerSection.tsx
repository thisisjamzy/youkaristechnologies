import { strings } from "@/content/strings";
import type { PhotoName } from "@/shared/lib";
import { Photo, Section, type PhotoProps } from "@/shared/ui";
import styles from "./StrangersInPrayerSection.module.scss";

const { strangersInPrayer } = strings.home;

// The three photos and their focus points, in the order of the reference.
const band: { name: PhotoName; focus: PhotoProps["focus"] }[] = [
  { name: "strangersRosaryMan", focus: "35" },
  { name: "strangersFamilyWorship", focus: "40" },
  { name: "strangersWindowPrayer", focus: "45" },
];

/** A row of three photos between "We are strangers" and "Not another prayer group". */
export function StrangersInPrayerSection() {
  return (
    <Section top="fluid-56-96" aria-label={strangersInPrayer.label} className={styles.band}>
      {band.map((photo, i) => (
        <Photo
          key={photo.name}
          name={photo.name}
          alt={strangersInPrayer.photoAlts[i]}
          focus={photo.focus}
          height="band"
          radius="xl"
          sizes="third"
          className={styles.photo}
        />
      ))}
    </Section>
  );
}
