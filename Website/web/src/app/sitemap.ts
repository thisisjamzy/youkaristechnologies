import type { MetadataRoute } from "next";
import { routes, siteUrl } from "@/shared/lib";

// The six pages (not anchors, not /dev/ui).
const pages = [routes.home, routes.ourStory, routes.pray, routes.give, routes.gather, routes.buildWithUs];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
