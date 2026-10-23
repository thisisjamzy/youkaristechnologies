import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { tokens } from "@/styles/tokens/tokens";
import { useBreakpoint, useFonts, useStrings, useTheme } from ".";

function mockViewport(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => {
    const min = Number(/min-width: (\d+)px/.exec(query)?.[1] ?? 0);
    return {
      matches: width >= min,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hooks", () => {
  it("useTheme returns the tokens", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.colors.lime).toBe(tokens.colors.lime);
  });

  it("useStrings returns the strings", () => {
    const { result } = renderHook(() => useStrings());
    expect(result.current).toBe(strings);
  });

  it("useFonts returns the three roles and the type scale", () => {
    const { result } = renderHook(() => useFonts());
    expect(Object.keys(result.current)).toEqual(["display", "body", "label", "scale"]);
    expect(result.current.display.variable).toBe("--font-nohemi");
  });

  it.each([
    [390, "mobile"],
    [768, "tablet"],
    [1024, "laptop"],
    [1440, "desktop"],
    [1600, "wide"],
  ])("useBreakpoint at %ipx is %s", (width, expected) => {
    mockViewport(width);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe(expected);
  });
});
