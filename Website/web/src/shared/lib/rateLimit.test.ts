import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rateLimit";

describe("createRateLimiter", () => {
  it("allows the limit per window, then refuses until the window moves", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.allow("a", 0)).toBe(true);
    expect(limiter.allow("a", 10)).toBe(true);
    expect(limiter.allow("a", 20)).toBe(false);
    expect(limiter.allow("b", 20)).toBe(true);
    expect(limiter.allow("a", 1001)).toBe(true);
  });
});
