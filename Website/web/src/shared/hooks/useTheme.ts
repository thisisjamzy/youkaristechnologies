"use client";

import { createContext, useContext } from "react";
import { tokens, type Tokens } from "@/styles/tokens/tokens";

export const ThemeContext = createContext<Tokens>(tokens);

/** The typed tokens, for the rare cases JavaScript needs a design value. Style with SCSS. */
export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
