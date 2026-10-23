import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { whatsAppShareUrl } from "./whatsApp";

describe("whatsAppShareUrl", () => {
  it("encodes the whole share message, including the site link", () => {
    const url = whatsAppShareUrl(strings.common.share.fromClosingCard);
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(decodeURIComponent(url.slice("https://wa.me/?text=".length))).toBe(strings.common.share.fromClosingCard);
    expect(url).not.toContain(" ");
  });
});
