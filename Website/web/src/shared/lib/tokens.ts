import type { SpaceStep } from "@/styles/tokens/tokens";

/** Class-safe key for a space step: 2.5 → "2_5", matching space-key() in SCSS. */
export const spaceKey = (step: SpaceStep | number) => String(step).replace(".", "_");

/** camelCase token name → kebab-case class suffix, matching the generated SCSS map keys. */
export const tokenKey = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
