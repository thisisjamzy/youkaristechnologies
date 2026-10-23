import { iconSizes, iconStrokes, type IconSize } from "@/styles/tokens/tokens";

export type ArrowDirection = "right" | "upRight" | "down" | "chevron";

export type ArrowIconProps = {
  direction?: ArrowDirection;
  size?: IconSize;
  stroke?: keyof typeof iconStrokes;
  className?: string;
};

const paths: Record<ArrowDirection, string> = {
  right: "M5 12h13M13 6l6 6-6 6",
  upRight: "M7 17L17 7M9 7h8v8",
  down: "M12 5v13M6 13l6 6 6-6",
  chevron: "M8 5l7 7-7 7",
};

/** The brand arrow, square caps, in currentColor. Decorative: always aria-hidden. */
export function ArrowIcon({ direction = "right", size = "md", stroke = "bold", className }: ArrowIconProps) {
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
      <path d={paths[direction]} />
    </svg>
  );
}
