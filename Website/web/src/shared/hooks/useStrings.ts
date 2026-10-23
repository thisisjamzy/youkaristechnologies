"use client";

import { createContext, useContext } from "react";
import { strings, type Strings } from "@/content/strings";

export const StringsContext = createContext<Strings>(strings);

/** Every user-facing string. Server Components import `strings` directly instead. */
export function useStrings(): Strings {
  return useContext(StringsContext);
}
