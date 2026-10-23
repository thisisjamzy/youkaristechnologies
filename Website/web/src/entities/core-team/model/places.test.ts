import { describe, expect, it } from "vitest";
import { parsePlaces, placesLeftToShow } from "./places";

describe("places", () => {
  it("parses the backend reply", () => {
    expect(parsePlaces({ ok: true, total: 20, filled: 3, left: 17, accepting: true })).toEqual({
      total: 20,
      filled: 3,
      left: 17,
      accepting: true,
    });
  });

  it.each([null, {}, { ok: false, error: "server" }, { ok: true, left: "17" }])("rejects %j", (value) => {
    expect(parsePlaces(value)).toBeNull();
  });

  it("shows 0 when applications are closed, null when unknown", () => {
    expect(placesLeftToShow({ total: 20, filled: 3, left: 17, accepting: false })).toBe(0);
    expect(placesLeftToShow(null)).toBeNull();
  });
});
