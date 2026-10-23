import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokens } from "../src/styles/tokens/tokens";
import { renderScss, renderTailwindTheme } from "./lib/render-tokens";

const dir = resolve(import.meta.dirname, "../src/styles/tokens");

const outputs = {
  "_tokens.generated.scss": renderScss(tokens),
  "tailwind-theme.generated.css": renderTailwindTheme(tokens),
};

for (const [file, content] of Object.entries(outputs)) {
  writeFileSync(resolve(dir, file), content);
  console.log(`tokens: wrote src/styles/tokens/${file}`);
}
