"use client";

import { useEffect, useRef, useState } from "react";

export type HideOnScrollOptions = {
  /** Below this scroll position the header counts as "at the top" and always shows. */
  offset: number;
  /** Pixels moved in one direction before it reacts. */
  threshold?: number;
  /** Keep it shown (menu open, focus inside the header). */
  forceShow?: boolean;
};

export type HideOnScroll = { hidden: boolean; atTop: boolean };

/**
 * Hides on scrolling down, shows on scrolling up. One passive listener, read inside
 * requestAnimationFrame, and state only changes when `hidden` or `atTop` change, so it does
 * not re-render on every pixel.
 */
export function useHideOnScroll({ offset, threshold = 8, forceShow = false }: HideOnScrollOptions): HideOnScroll {
  const [state, setState] = useState<HideOnScroll>({ hidden: false, atTop: true });
  const forceRef = useRef(forceShow);

  useEffect(() => {
    forceRef.current = forceShow;
  }, [forceShow]);

  useEffect(() => {
    let lastY = window.scrollY;
    let anchorY = lastY; // where the current direction started
    let direction: "up" | "down" | null = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const nextDirection = y > lastY ? "down" : y < lastY ? "up" : direction;
      if (nextDirection !== direction) {
        direction = nextDirection;
        anchorY = lastY;
      }
      lastY = y;

      const atTop = y < offset;
      setState((s) => {
        let hidden = s.hidden;
        if (atTop || forceRef.current) hidden = false;
        else if (direction === "down" && y - anchorY > threshold) hidden = true;
        else if (direction === "up" && anchorY - y > threshold) hidden = false;
        return hidden === s.hidden && atTop === s.atTop ? s : { hidden, atTop };
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [offset, threshold]);

  // Forced: always shown, whatever the last scroll said.
  return forceShow ? { hidden: false, atTop: state.atTop } : state;
}
