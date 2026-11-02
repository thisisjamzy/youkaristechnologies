import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("redirects", () => {
  it("sends /build-with-us to /volunteer permanently", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toContainEqual({ source: "/build-with-us", destination: "/volunteer", permanent: true });
  });
});
