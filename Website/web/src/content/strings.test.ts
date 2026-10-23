import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { strings } from "./strings";

const MASTER_PATH = resolve(__dirname, "../../../sfm-website-build-kit/content/strings-master.md");
const master = readFileSync(MASTER_PATH, "utf8");

// The master has no script block for Pray, so its day list comes from the design file.
const PRAY_DESIGN_PATH = resolve(__dirname, "../../../sfm-website-build-kit/design-reference/pray.html");
const prayScript = /data-dc-script[^>]*>([\s\S]*?)<\/script>/.exec(readFileSync(PRAY_DESIGN_PATH, "utf8"))?.[1] ?? "";

// Any number works: functions are compared with the master's {{spotsLeft}} lines.
const SAMPLE_LEFT = 17;

/** The master with the server value filled in, plus the Pray script: everything strings.ts may say. */
const sources = master.replaceAll("{{spotsLeft}}", String(SAMPLE_LEFT)) + prayScript;

// Keys that hold data for components rather than copy.
const NON_COPY_KEYS = new Set(["kind"]);

type Leaf = { path: string; value: string };

function leaves(node: unknown, path = "strings"): Leaf[] {
  if (typeof node === "string") return [{ path, value: node }];
  if (typeof node === "function") return [{ path: `${path}()`, value: String(node(SAMPLE_LEFT)) }];
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node)
      .filter(([k]) => !NON_COPY_KEYS.has(k))
      .flatMap(([k, v]) => leaves(v, `${path}.${k}`));
  }
  return [];
}

/** Every text the master says must appear on the site. */
function masterTexts(): string[] {
  const [design, added] = master.split("## Added for the build");
  const texts: string[] = [];

  // Design lines: "- Kind: text". Skip structure and the accordion's "+" icon.
  for (const [, kind, raw] of design.matchAll(/^- ([A-Za-z0-9 ]+): (.+)$/gm)) {
    if (kind === "Repeats" || kind === "Condition") continue;
    if (kind === "Question" && raw === "+") continue;
    const text = raw
      .replace(/ \[link to add\]$/, "")
      .replace(/^\[(.+)\]$/, "$1")
      .replaceAll("{{spotsLeft}}", String(SAMPLE_LEFT));
    if (text.includes("{{") || text === String(SAMPLE_LEFT)) continue; // filled from lists or the server
    texts.push(text);
  }

  // Lists and dynamic text in the page script blocks (skip photo paths).
  const scripts = [...design.matchAll(/```js\n([\s\S]*?)```/g)].map((m) => m[1]).concat(prayScript);
  for (const block of scripts) {
    for (const [, literal] of block.matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
      if (!literal.includes(".jpg")) texts.push(literal);
    }
  }

  // "Added for the build": "- Label: text", where metadata and not-found lines hold two strings.
  for (const [, line] of added.matchAll(/^- (.+)$/gm)) {
    const text = line.slice(line.indexOf(": ") + 2);
    const [title, description] = text.split(". Description: ");
    if (description) texts.push(title, description);
    else texts.push(...text.split(" Link: "));
  }

  return texts;
}

const all = leaves(strings);
const values = new Set(all.map((l) => l.value));

describe("strings.ts against the strings master", () => {
  it.each(masterTexts().map((t) => [t]))("contains %j", (text) => {
    // Some build lines list several strings at once ("Our Story, Pray, …", "PASS IT ON. / …").
    const parts = text.split(/\s+\/\s+|,\s+/);
    expect(values.has(text) || (parts.length > 1 && parts.every((part) => values.has(part)))).toBe(true);
  });

  it("invents nothing: every string is a master line or part of one", () => {
    const invented = all.filter((l) => !sources.includes(l.value)).map((l) => `${l.path}: ${l.value}`);
    expect(invented).toEqual([]);
  });

  it("has no TODO keys left", () => {
    expect(all.filter((l) => l.path.includes("TODO")).map((l) => l.path)).toEqual([]);
  });
});

describe("copy rules", () => {
  it("has no em dashes", () => {
    expect(all.filter((l) => l.value.includes("—")).map((l) => l.path)).toEqual([]);
  });

  it('never uses the word "pillar"', () => {
    const pattern = /pillar/i;
    expect(all.filter((l) => pattern.test(l.value) || pattern.test(l.path)).map((l) => l.path)).toEqual([]);
  });

  it("has no exclamation marks in headlines", () => {
    const headlines = all.filter((l) => /\.(headline|title)\b/.test(l.path));
    expect(headlines.length).toBeGreaterThan(0);
    expect(headlines.filter((l) => l.value.includes("!")).map((l) => l.path)).toEqual([]);
  });
});
