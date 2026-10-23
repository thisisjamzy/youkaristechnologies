"use client";

import { useSyncExternalStore } from "react";
import { breakpoints, type BreakpointName } from "@/styles/tokens/tokens";

/** "mobile" is everything below the first breakpoint. */
export type Breakpoint = "mobile" | BreakpointName;

// Widest first, so the first match wins.
const ordered = (Object.entries(breakpoints) as [BreakpointName, number][]).sort(
  ([, a], [, b]) => b - a,
);

const queries = () => ordered.map(([name, min]) => [name, window.matchMedia(`(min-width: ${min}px)`)] as const);

function getSnapshot(): Breakpoint {
  return queries().find(([, mql]) => mql.matches)?.[0] ?? "mobile";
}

function subscribe(onChange: () => void) {
  const mqls = queries().map(([, mql]) => mql);
  mqls.forEach((mql) => mql.addEventListener("change", onChange));
  return () => mqls.forEach((mql) => mql.removeEventListener("change", onChange));
}

// Mobile-first: the server and first paint assume the smallest screen.
const getServerSnapshot = (): Breakpoint => "mobile";

/** The current breakpoint name from tokens.ts. Prefer CSS media queries for layout. */
export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
