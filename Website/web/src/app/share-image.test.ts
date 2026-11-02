import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";

// The alt text has to live in .alt.txt files (Next.js file convention); keep them equal to strings.
describe("share image alt text", () => {
  it.each(["opengraph-image.alt.txt", "twitter-image.alt.txt"])("%s matches strings.common.meta.share.imageAlt", (file) => {
    expect(readFileSync(resolve(__dirname, file), "utf8").trim()).toBe(strings.common.meta.share.imageAlt);
  });
});

// The share image is a designed asset from the kit (assets/social/og-source.html), never drawn in code.
describe("share image", () => {
  const kitImage = readFileSync(resolve(__dirname, "../../../sfm-website-build-kit/assets/social/sfm-og-1200x630.jpg"));
  it.each(["opengraph-image.jpg", "twitter-image.jpg"])("%s is the kit's sfm-og-1200x630.jpg", (file) => {
    expect(readFileSync(resolve(__dirname, file)).equals(kitImage)).toBe(true);
  });
});
