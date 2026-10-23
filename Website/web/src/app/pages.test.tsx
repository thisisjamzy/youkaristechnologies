import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BuildWithUsView } from "@/views/BuildWithUs";
import { GatherView } from "@/views/Gather";
import { GiveView } from "@/views/Give";
import { HomeView } from "@/views/Home";
import { OurStoryView } from "@/views/OurStory";
import { PrayView } from "@/views/Pray";

const KIT = resolve(__dirname, "../../../sfm-website-build-kit");
const master = readFileSync(resolve(KIT, "content/strings-master.md"), "utf8");
// The master has no script block for Pray; its day list is in the design file.
const prayScript =
  /data-dc-script[^>]*>([\s\S]*?)<\/script>/.exec(readFileSync(resolve(KIT, "design-reference/pray.html"), "utf8"))?.[1] ?? "";

// A number shows the places lines that hide while the backend is unknown.
const PLACES = 17;

const pages: { name: string; view: ReactElement; script?: string }[] = [
  { name: "Home", view: <HomeView placesLeft={PLACES} /> },
  { name: "Our Story", view: <OurStoryView /> },
  { name: "Pray", view: <PrayView />, script: prayScript },
  { name: "Give", view: <GiveView /> },
  { name: "Gather", view: <GatherView /> },
  { name: "Build With Us", view: <BuildWithUsView placesLeft={PLACES} /> },
];

/** Every text the master lists for one page: its design lines and its script lists. */
function linesFor(page: string, extraScript = ""): string[] {
  const start = master.indexOf(`\n## ${page}\n`);
  const end = master.indexOf("\n## ", start + 1);
  const section = master.slice(start, end);
  const lines: string[] = [];
  for (const [, kind, raw] of section.matchAll(/^- ([A-Za-z0-9 ]+): (.+)$/gm)) {
    if (kind === "Repeats" || kind === "Condition" || raw === "+") continue;
    const text = raw.replace(/^\[(.+)\]$/, "$1");
    if (!text.includes("{{")) lines.push(text);
  }
  const scripts = [...section.matchAll(/```js\n([\s\S]*?)```/g)].map((m) => m[1]).concat(extraScript);
  for (const block of scripts) {
    for (const [, literal] of block.matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
      if (!literal.includes(".jpg")) lines.push(literal);
    }
  }
  return lines;
}

/** Text nodes plus the attributes a visitor meets: alt text, placeholders, aria labels. */
function collect(root: HTMLElement, into: Set<string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim();
    if (text) into.add(text);
  }
  for (const el of root.querySelectorAll("[alt], [placeholder], [aria-label]")) {
    for (const attr of ["alt", "placeholder", "aria-label"]) {
      const value = el.getAttribute(attr);
      if (value) into.add(value);
    }
  }
}

// A valid sign-up, typed into whichever of these fields the form has.
const typed: Record<string, string> = {
  fullName: "Mary Ndi",
  baptismName: "Mary",
  email: "mary@example.org",
  parish: "St Anthony",
  city: "Buea, Cameroon",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Renders the page and walks its form states, so conditional text is seen too. */
async function renderedTexts(view: ReactElement): Promise<Set<string>> {
  const { container } = render(view);
  const texts = new Set<string>();
  collect(container, texts);

  // Home: reveal the core team questions.
  const apply = screen.queryByRole("checkbox", { name: /Apply for the core team/ });
  if (apply) {
    fireEvent.click(apply);
    collect(container, texts);
  }

  // Both forms: a valid submission shows the success state.
  const form = container.querySelector("form");
  if (form) {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true, placesLeft: PLACES, coreTeamFull: false })));
    for (const [name, value] of Object.entries(typed)) {
      const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (input) fireEvent.change(input, { target: { value } });
    }
    fireEvent.submit(form);
    await waitFor(() => expect(container.querySelector('[role="status"]')).not.toBeNull());
    collect(container, texts);
  }
  return texts;
}

describe.each(pages)("$name page", ({ name, view, script }) => {
  it("shows every line of the strings master for this page", async () => {
    const texts = await renderedTexts(view);
    const missing = linesFor(name, script).filter((line) => !texts.has(line));
    expect(missing).toEqual([]);
  });
});

