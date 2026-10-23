import type { ReactNode } from "react";
import { iconSizes, iconStrokes, type IconSize } from "@/styles/tokens/tokens";

export type IconName =
  | "globe"
  | "person"
  | "leave"
  | "pen"
  | "clock"
  | "heart"
  | "instagram"
  | "whatsApp"
  | "mail"
  | "check";

export type IconProps = {
  name: IconName;
  size?: IconSize;
  stroke?: keyof typeof iconStrokes;
  className?: string;
};

// Shapes copied from the design reference.
const shapes: Record<IconName, ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </>
  ),
  leave: <path d="M9 6H5v12h4M15 8l4 4-4 4M19 12H9" />,
  pen: <path d="M14.5 5.5l4 4L9 19H5v-4z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h.01" />
    </>
  ),
  whatsApp: <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </>
  ),
  check: <path d="M4 12l5 5L20 6" />,
};

/** Line icon, square caps, in currentColor. Decorative: label the control around it. */
export function Icon({ name, size = "lg", stroke = "thin", className }: IconProps) {
  const px = iconSizes[size];
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStrokes[stroke]}
      strokeLinecap="square"
    >
      {shapes[name]}
    </svg>
  );
}
