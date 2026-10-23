import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
