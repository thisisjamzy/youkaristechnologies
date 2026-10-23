import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHideOnScroll } from "./useHideOnScroll";

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
  });
}

beforeEach(() => {
  // Run animation frames straight away (returning 0: no frame left pending).
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useHideOnScroll", () => {
  it("stays shown at the top", () => {
    const { result } = renderHook(() => useHideOnScroll({ offset: 88 }));
    scrollTo(40);
    expect(result.current).toEqual({ hidden: false, atTop: true });
  });

  it("hides after scrolling down past the threshold, shows after scrolling up", () => {
    const { result } = renderHook(() => useHideOnScroll({ offset: 88 }));
    scrollTo(200); // 200px down from the top
    expect(result.current.hidden).toBe(true);
    expect(result.current.atTop).toBe(false);
    scrollTo(203); // 2px up: not enough
    expect(result.current.hidden).toBe(true);
    scrollTo(190); // 15px up
    expect(result.current.hidden).toBe(false);
  });

  it("stays shown while forced (menu open, focus inside)", () => {
    const { result, rerender } = renderHook((props: { force: boolean }) => useHideOnScroll({ offset: 88, forceShow: props.force }), {
      initialProps: { force: true },
    });
    scrollTo(400);
    expect(result.current.hidden).toBe(false);
    rerender({ force: false });
    scrollTo(500);
    expect(result.current.hidden).toBe(true);
    rerender({ force: true });
    expect(result.current.hidden).toBe(false);
  });
});
