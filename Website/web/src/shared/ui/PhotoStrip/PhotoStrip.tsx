import type { PhotoName } from "@/shared/lib";
import { cn } from "@/shared/lib";
import { Photo, type PhotoProps } from "../Photo";
import styles from "./PhotoStrip.module.scss";

export type StripPhoto = { name: PhotoName; alt: string; focus?: PhotoProps["focus"] };

export type PhotoStripProps = {
  photos: readonly StripPhoto[];
  className?: string;
};

/** A row of photos in a lime frame (Pray: "Your week as a stranger"). The one large lime element there. */
export function PhotoStrip({ photos, className }: PhotoStripProps) {
  return (
    <div className={cn(styles.strip, className)}>
      {photos.map((photo) => (
        <Photo key={photo.name} {...photo} height={95} radius="lg" sizes="third" />
      ))}
    </div>
  );
}
