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
