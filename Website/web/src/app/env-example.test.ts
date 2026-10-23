import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// .env.example is committed: it must only ever hold blank placeholders for secrets.
// Real values go in .env.local, which git ignores.
describe(".env.example", () => {
  it("has no Apps Script URL or secret filled in", () => {
    const text = readFileSync(resolve(__dirname, "../../.env.example"), "utf8");
    for (const key of ["APPS_SCRIPT_URL", "APPS_SCRIPT_SECRET"]) {
      const line = text.split("\n").find((l) => l.startsWith(`${key}=`));
      expect(line, `${key} must be blank in .env.example; put the value in .env.local`).toBe(`${key}=`);
    }
  });
});
