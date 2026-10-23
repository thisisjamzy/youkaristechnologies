import Image from "next/image";
import { cn } from "@/shared/lib";
import styles from "./Mark.module.scss";

// The supplied chevron M mark, used as it is.
const files = {
  ink: "/brand/sfm-mark-ink.svg",
  lime: "/brand/sfm-mark-lime.svg",
} as const;

// Intrinsic size from the SVG viewBox (2000 × 1055).
const WIDTH = 2000;
const HEIGHT = 1055;

export type MarkProps = {
  variant?: keyof typeof files;
  /** Width: `sm` 52px, `md` 54px, `fluid` fills its box up to 360px. */
  size?: "sm" | "md" | "fluid";
  /** Empty (decorative) unless the mark is the subject, as on Our Story. */
  alt?: string;
  className?: string;
};

/** The Strangers for Mary mark alone. `<Mark size="sm" />` */
export function Mark({ variant = "ink", size = "sm", alt = "", className }: MarkProps) {
  return (
    <Image
      src={files[variant]}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      width={WIDTH}
      height={HEIGHT}
      className={cn(styles.mark, styles[size], className)}
    />
  );
}
