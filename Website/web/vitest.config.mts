import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const fontStub = path.resolve("test/stubs/next-font.ts");

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "next/font/google": fontStub,
      "next/font/local": fontStub,
    },
  },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [path.resolve("src/styles")] },
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
