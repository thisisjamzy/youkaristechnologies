import type { Metadata } from "next";
import { strings } from "@/content/strings";

const { share } = strings.common.meta;

/**
 * The designed share image (src/app/opengraph-image.jpg and twitter-image.jpg, 1200 by 630,
 * from the build kit's assets/social). The root page gets it from the file convention; other
 * pages set their own openGraph, which replaces the inherited image, so they attach it here.
 */
const shareImage = { width: 1200, height: 630, type: "image/jpeg", alt: share.imageAlt };

/** Open Graph and X defaults for every page. */
const openGraph = {
  type: "website" as const,
  siteName: share.siteName,
  locale: "en",
  images: [{ url: "/opengraph-image.jpg", ...shareImage }],
};
const twitter = {
  card: "summary_large_image" as const,
  images: [{ url: "/twitter-image.jpg", ...shareImage }],
};

/** The site-wide share metadata, used by the root layout. */
export const siteShareMetadata: Pick<Metadata, "openGraph" | "twitter"> = {
  openGraph: { ...openGraph, title: share.title, description: share.description },
  twitter: { ...twitter, title: share.title, description: share.description },
};

/**
 * A page's metadata. Next.js replaces (does not merge) a parent's openGraph and twitter
 * objects, so every page rebuilds them on the shared defaults.
 */
export function pageMetadata({ title, description }: { title: string; description: string }): Metadata {
  return {
    title,
    description,
    openGraph: { ...openGraph, title, description },
    twitter: { ...twitter, title, description },
  };
}
