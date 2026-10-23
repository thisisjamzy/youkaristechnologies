import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const fontStub = path.resolve("test/stubs/next-font.ts");
const serverOnlyStub = path.resolve("test/stubs/server-only.ts");

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // For Sass `@use "@/styles/abstracts"`, which tsconfig paths do not reach.
      "@/": `${path.resolve("src")}/`,
      "next/font/google": fontStub,
      "next/font/local": fontStub,
      "server-only": serverOnlyStub,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
    passWithNoTests: true,
  },
});
