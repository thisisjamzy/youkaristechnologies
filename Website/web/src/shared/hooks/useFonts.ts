"use client";

import { createContext, useContext } from "react";
import { fonts, type Fonts } from "@/styles/fonts";

export const FontsContext = createContext<Fonts>(fonts);

/** `{ display, body, label }` (className, variable, family) plus the type scale. */
export function useFonts(): Fonts {
  return useContext(FontsContext);
}
