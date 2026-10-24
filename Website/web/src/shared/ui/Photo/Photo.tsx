import Image from "next/image";
import { breakpoints, layout, type BoxStep, type FluidSizeName, type RadiusName } from "@/styles/tokens/tokens";
import { cn, photos, spaceKey, tokenKey, type PhotoName } from "@/shared/lib";
import styles from "./Photo.module.scss";

/** A step on the 4px scale (105 = 420px), a fluid size (`hero`), or `fill` to fill a grid cell. */
export type PhotoHeight = BoxStep | FluidSizeName | "fill";

const page = `(min-width: ${layout.container + layout.gutter * 2}px) ${layout.container}px, 100vw`;

/** `sizes` presets from the layout tokens: how wide the photo renders at each breakpoint. */
export const photoSizes = {
  full: page,
  half: `(min-width: ${breakpoints.laptop}px) ${layout.container / 2}px, 100vw`,
  third: `(min-width: ${breakpoints.laptop}px) ${Math.round(layout.container / 3)}px, (min-width: ${breakpoints.tablet}px) 50vw, 100vw`,
  quarter: `(min-width: ${breakpoints.laptop}px) ${layout.container / 4}px, (min-width: ${breakpoints.tablet}px) 50vw, 100vw`,
  thumb: `${layout.container / 4}px`,
} as const;

export type PhotoProps = {
  name: PhotoName;
  /** Descriptive alt from strings, or "" when decorative. */
  alt: string;
  height: PhotoHeight;
  /** With `height="fill"`: the smallest height on the 4px scale. */
  minHeight?: BoxStep;
  radius?: RadiusName;
  /** Vertical focus point, as in the reference (`object-position: center 30%`). */
  focus?: "25" | "30" | "35" | "40" | "45";
  sizes?: keyof typeof photoSizes;
  /**
   * Only for the photo in the opening of a page (the LCP element): fetched first and never
   * lazy. Next 16 deprecates `priority` on next/image, so this maps to fetchPriority/loading.
   */
  priority?: boolean;
  className?: string;
};

const heightClass = (height: PhotoHeight) =>
  // Fluid sizes are camelCase in tokens.ts and kebab-case in the generated classes.
  typeof height === "number" ? `h-${spaceKey(height)}` : height === "fill" ? "fill" : `h-${tokenKey(height)}`;

/** A rounded photo, never tinted. `<Photo name="passRosary" alt={alt} height="fill" minHeight={100} />` */
export function Photo({
  name,
  alt,
  height,
  minHeight,
  radius = "2xl",
  focus,
  sizes = "full",
  priority,
  className,
}: PhotoProps) {
  return (
    <div
      className={cn(
        styles.photo,
        styles[heightClass(height)],
        minHeight !== undefined && styles[`min-${spaceKey(minHeight)}`],
        styles[`radius-${radius}`],
        className,
      )}
    >
      <Image
        src={photos[name]}
        alt={alt}
        fill
        sizes={photoSizes[sizes]}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : undefined}
        className={cn(styles.image, focus && styles[`focus-${focus}`])}
      />
    </div>
  );
}
