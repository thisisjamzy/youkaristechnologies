import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // `page.dev.tsx` (the /dev/ui preview) is a page only under `next dev`, so production builds
  // leave it out, along with its CSS, which would otherwise ride along on every page.
  pageExtensions:
    process.env.NODE_ENV === "production" ? ["tsx", "ts", "jsx", "js"] : ["dev.tsx", "tsx", "ts", "jsx", "js"],
  // Hide the dev-tools button; compile and runtime errors still show in dev.
  devIndicators: false,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // CSS modules (including compiled *.module.scss) must stay modules: re-typing them
        // "as *.css" turns them into global CSS and every `styles.x` becomes undefined.
        condition: { not: { path: /\.module\.s?css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
