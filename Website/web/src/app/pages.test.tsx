import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GatherView } from "@/views/Gather";
import { GiveView } from "@/views/Give";
import { HomeView } from "@/views/Home";
import { OurStoryView } from "@/views/OurStory";
import { PrayView } from "@/views/Pray";
import { RolesView } from "@/views/Roles";
import { VolunteerView } from "@/views/Volunteer";

const KIT = resolve(__dirname, "../../../sfm-website-build-kit");
const master = readFileSync(resolve(KIT, "content/strings-master.md"), "utf8");
// The master has no script block for Pray; its day list is in the design file.
const prayScript =
  /data-dc-script[^>]*>([\s\S]*?)<\/script>/.exec(readFileSync(resolve(KIT, "design-reference/pray.html"), "utf8"))?.[1] ?? "";

// The Roles page reads ?team= and ?role= through next/navigation.
const url = vi.hoisted(() => ({ search: "" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(url.search),
  usePathname: () => "/volunteer/roles",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() }),
}));

/** `searches`: render the page once per query string, so text that depends on the URL is seen too. */
const pages: { name: string; view: ReactElement; script?: string; searches?: string[] }[] = [
  { name: "Home", view: <HomeView /> },
  { name: "Our Story", view: <OurStoryView /> },
  { name: "Pray", view: <PrayView />, script: prayScript },
  { name: "Give", view: <GiveView /> },
  { name: "Gather", view: <GatherView /> },
  { name: "Volunteer", view: <VolunteerView /> },
  // With no role, the form asks for one; with the designer, it shows the questions and the portfolio link.
  { name: "Roles", view: <RolesView />, searches: ["", "role=brand-and-graphic-designer"] },
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
  // A label read as a whole, for lines with a bold first sentence.
  for (const label of root.querySelectorAll("label")) {
    const text = label.textContent?.replace(/\s+/g, " ").trim();
    if (text) into.add(text);
  }
  for (const el of root.querySelectorAll("[alt], [placeholder], [aria-label]")) {
    for (const attr of ["alt", "placeholder", "aria-label"]) {
      const value = el.getAttribute(attr);
      if (value) into.add(value);
    }
  }
}

// A valid sign-up or application, typed into whichever of these fields the form has.
const typed: Record<string, string> = {
  fullName: "Mary Ndi",
  baptismName: "Mary",
  phone: "+237 6 70 00 00 00",
  email: "mary@example.org",
  parish: "St Anthony",
  city: "Buea, Cameroon",
  q1: "An answer",
  q2: "An answer",
  q3: "An answer",
  links: "https://example.org/portfolio",
  hours: "Up to 3 hours",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Renders the page and walks its form states, so conditional text is seen too. */
async function renderedTexts(view: ReactElement, texts: Set<string>, submit: boolean): Promise<Set<string>> {
  const { container } = render(view);
  collect(container, texts);

  // Forms: a valid submission shows the success state.
  const form = container.querySelector("form");
  if (form && submit) {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true })));
    for (const [name, value] of Object.entries(typed)) {
      const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (input) fireEvent.change(input, { target: { value } });
    }
    for (const box of form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name^="confirm"]')) {
      fireEvent.click(box);
    }
    const cv = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (cv) await userEvent.upload(cv, new File(["%PDF-1.7"], "cv.pdf", { type: "application/pdf" }));
    collect(container, texts);
    fireEvent.submit(form);
    await waitFor(() => expect(container.querySelector('[role="status"]')).not.toBeNull());
    collect(container, texts);
  }
  return texts;
}

async function allTexts(view: ReactElement, searches = [""]): Promise<Set<string>> {
  const texts = new Set<string>();
  for (const [i, search] of searches.entries()) {
    url.search = search;
    // Submit only on the last render: the Roles form cannot succeed before a role is chosen.
    await renderedTexts(view, texts, i === searches.length - 1);
    cleanup();
  }
  return texts;
}

describe.each(pages)("$name page", ({ name, view, script, searches }) => {
  it("shows every line of the strings master for this page", async () => {
    const texts = await allTexts(view, searches);
    const missing = linesFor(name, script).filter((line) => !texts.has(line));
    expect(missing).toEqual([]);
  });

  it("no longer counts core team places", async () => {
    const text = [...(await allTexts(view, searches))].join("\n");
    expect(text).not.toMatch(/places still open|20 places/i);
  });
});

