import { describe, expect, it } from "vitest";
import { tokens } from "../../src/styles/tokens/tokens";
import { cssVariables, renderScss, renderTailwindTheme, spaceVar } from "./render-tokens";

describe("render-tokens", () => {
  const vars = Object.fromEntries(cssVariables(tokens));

  it("names variables in kebab case by group", () => {
    expect(vars["--color-lime"]).toBe("#D1FF42");
    expect(vars["--color-mist-tint"]).toBe("#EEF1F4");
    expect(vars["--radius-pill"]).toBe("999px");
    expect(vars["--shadow-float"]).toBe("0 24px 48px rgba(10, 15, 26, 0.08)");
  });

  it("puts space on the 4px unit, with decimals as underscores", () => {
    expect(spaceVar(2.5)).toBe("--space-2_5");
    expect(vars["--space-6"]).toBe("24px");
    expect(vars["--space-2_5"]).toBe("10px");
    expect(vars["--space-0"]).toBe("0");
  });

  it("renders fluid values as clamp()", () => {
    expect(vars["--text-display-xl"]).toBe("clamp(44px, 6vw, 84px)");
    expect(vars["--space-section"]).toBe("clamp(96px, 12vw, 160px)");
  });

  it("wraps :root in a mixin so CSS modules never re-emit it", () => {
    const scss = renderScss(tokens);
    expect(scss).toMatch(/^@mixin css-variables \{\n {2}:root \{/m);
    expect(scss).toContain('$breakpoints: (\n  "tablet": 640px,');
    expect(scss).toContain("2.5: var(--space-2_5),");
  });

  it("replaces Tailwind defaults with our tokens and the 4px spacing unit", () => {
    const css = renderTailwindTheme(tokens);
    expect(css).toContain("--*: initial;");
    expect(css).toContain("--spacing: 4px;");
    expect(css).toContain("--breakpoint-laptop: 1024px;");
    expect(css).not.toContain("--space-");
  });
});
