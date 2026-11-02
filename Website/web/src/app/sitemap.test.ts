import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists Volunteer and Roles, and not Build With Us", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://www.strangersformary.org/volunteer");
    expect(urls).toContain("https://www.strangersformary.org/volunteer/roles");
    expect(urls.some((url) => url.includes("build-with-us"))).toBe(false);
  });
});
