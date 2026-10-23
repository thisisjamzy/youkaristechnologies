import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Photo, type PhotoProps } from "../Photo";
import styles from "./PhotoWithOverlay.module.scss";

export type PhotoWithOverlayProps = PhotoProps & {
  /** `<Overlay>` items: chips, frosted cards, folder-tab cards. */
  children: ReactNode;
  wrapperClassName?: string;
};

/** A photo with things floating on it. */
export function PhotoWithOverlay({ children, wrapperClassName, ...photo }: PhotoWithOverlayProps) {
  return (
    <div className={cn(styles.wrapper, wrapperClassName)}>
      <Photo {...photo} />
      {children}
    </div>
  );
}

export type OverlayProps = {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "bottomEdge";
  /** Distance from the photo edge: 3.5 (14px), 4 (16px) or 6 (24px, default). */
  inset?: 3.5 | 4 | 6;
  /**
   * Cards that overlap the photo on desktop sit under it on phones, in reading order.
   * Section modules can move a stacked overlay further with `className`.
   */
  stackOnMobile?: boolean;
  className?: string;
  children: ReactNode;
};

/** One item on a photo. `<Overlay position="bottomLeft"><FrostedCard>...</FrostedCard></Overlay>` */
export function Overlay({ position, inset = 6, stackOnMobile, className, children }: OverlayProps) {
  return (
    <div
      className={cn(
        styles.overlay,
        styles[position],
        styles[`inset-${String(inset).replace(".", "_")}`],
        stackOnMobile && styles.stack,
        className,
      )}
    >
      {children}
    </div>
  );
}
