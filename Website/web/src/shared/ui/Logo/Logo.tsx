import Image from "next/image";
import { cn } from "@/shared/lib";
import styles from "./Logo.module.scss";

// The supplied SVGs, used as they are. Never redraw or retype the logo.
const files = {
  ink: "/brand/sfm-logo-ink.svg",
  limeOnDark: "/brand/sfm-logo-lime-on-dark.svg",
} as const;

// Intrinsic size from the SVG viewBox (6148 × 1055).
const WIDTH = 6148;
const HEIGHT = 1055;

export type LogoProps = {
  /** `ink` for light grounds, `limeOnDark` for ink grounds. */
  variant?: keyof typeof files;
  /** Height: `md` 40px (header), `lg` 44px (footer). */
  size?: "md" | "lg";
  alt: string;
  priority?: boolean;
  className?: string;
};

/** The full Strangers for Mary logo. `<Logo alt={strings.common.header.logoAlt} />` */
export function Logo({ variant = "ink", size = "md", alt, priority, className }: LogoProps) {
  return (
    <Image
      src={files[variant]}
      alt={alt}
      width={WIDTH}
      height={HEIGHT}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : undefined}
      className={cn(styles.logo, styles[size], className)}
    />
  );
}
