"use client";

import { useBreakpoint, useFonts } from "@/shared/hooks";

export function CurrentBreakpoint() {
  const breakpoint = useBreakpoint();
  const fonts = useFonts();
  return (
    <p>
      useBreakpoint(): <strong>{breakpoint}</strong> · useFonts().display.family:{" "}
      <code>{fonts.display.family}</code>
    </p>
  );
}
