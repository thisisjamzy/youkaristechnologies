"use client";

import type { ReactNode } from "react";
import { FontsContext, StringsContext, ThemeContext } from "@/shared/hooks";
import { fonts } from "@/styles/fonts";
import { strings } from "@/content/strings";
import { tokens } from "@/styles/tokens/tokens";

// Values are imported here rather than passed from the server layout, because
// strings will hold functions (e.g. placesLeft) that cannot cross the boundary.

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext value={tokens}>{children}</ThemeContext>;
}

export function FontsProvider({ children }: { children: ReactNode }) {
  return <FontsContext value={fonts}>{children}</FontsContext>;
}

export function StringsProvider({ children }: { children: ReactNode }) {
  return <StringsContext value={strings}>{children}</StringsContext>;
}

/** All app-wide providers, used once in src/app/layout.tsx. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FontsProvider>
        <StringsProvider>{children}</StringsProvider>
      </FontsProvider>
    </ThemeProvider>
  );
}
