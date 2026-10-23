import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Every user-facing word lives in src/content/strings.ts.
    files: ["src/**/*.tsx"],
    // /dev/ui is an internal preview, blocked in production, so its labels are not site copy.
    ignores: ["src/**/*.test.tsx", "src/app/dev/**"],
    rules: {
      "react/jsx-no-literals": ["error", { noStrings: true, ignoreProps: true }],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Layers import only downward: app → views → widgets → features → entities → shared.
  // Items on the same layer never import each other (inside an item, use relative paths).
  ...[
    { layer: "shared", banned: ["core", "views", "widgets", "features", "entities"] },
    { layer: "entities", banned: ["core", "views", "widgets", "features", "entities"] },
    { layer: "features", banned: ["core", "views", "widgets", "features"] },
    { layer: "widgets", banned: ["core", "views", "widgets"] },
    { layer: "views", banned: ["core", "views"] },
  ].map(({ layer, banned }) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: banned.map((b) => ({
            group: [`@/${b}`, `@/${b}/**`],
            message: `${layer} must not import from ${b}: imports only point down the layers, never sideways.`,
          })),
        },
      ],
    },
  })),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
]);

export default eslintConfig;
