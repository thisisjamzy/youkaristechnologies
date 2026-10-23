import { z } from "zod";

/** Core team places as the backend reports them (GET ?action=places). */
export const placesSchema = z.object({
  ok: z.literal(true),
  total: z.number().int().nonnegative(),
  filled: z.number().int().nonnegative(),
  left: z.number().int().nonnegative(),
  accepting: z.boolean(),
});

export type Places = Omit<z.infer<typeof placesSchema>, "ok">;

/** Parses a backend reply; anything unexpected is null, so the site hides the number. */
export function parsePlaces(value: unknown): Places | null {
  const result = placesSchema.safeParse(value);
  if (!result.success) return null;
  const { total, filled, left, accepting } = result.data;
  return { total, filled, left, accepting };
}

/** The number the site shows: 0 when applications are closed, so the team reads as complete. */
export function placesLeftToShow(places: Places | null): number | null {
  if (!places) return null;
  return places.accepting ? places.left : 0;
}
