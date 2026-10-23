import type { PhotoName } from "@/shared/lib";
import { cn } from "@/shared/lib";
import { Photo, type PhotoProps } from "../Photo";
import styles from "./PhotoMosaic.module.scss";

export type MosaicTile =
  | { kind: "photo"; name: PhotoName; alt: string; focus?: PhotoProps["focus"] }
  | { kind: "text"; title: string; text: string; tone?: "white" | "lime" };

export type PhotoMosaicProps = {
  /** Tiles in reading order; photo and text tiles alternate. */
  tiles: readonly MosaicTile[];
  className?: string;
};

/** Alternating photo and text tiles (Gather: "What happens when we gather"). */
export function PhotoMosaic({ tiles, className }: PhotoMosaicProps) {
  return (
    <div className={cn(styles.mosaic, className)}>
      {tiles.map((tile) =>
        tile.kind === "photo" ? (
          <Photo key={tile.name} name={tile.name} alt={tile.alt} focus={tile.focus} height={75} radius="lg-plus" sizes="quarter" />
        ) : (
          <div key={tile.title} className={cn(styles.tile, styles[tile.tone ?? "white"])}>
            <h3 className={styles.title}>{tile.title}</h3>
            <p className={styles.text}>{tile.text}</p>
          </div>
        ),
      )}
    </div>
  );
}
