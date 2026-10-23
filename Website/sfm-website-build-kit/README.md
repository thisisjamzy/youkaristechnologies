# Strangers for Mary website build kit

Everything Claude Code or Cursor needs to build the pre-launch website exactly as designed.

## What is inside

| Path | What it is |
| --- | --- |
| `../apps-script/` (in `Website/apps-script/`) | The finished backend: `Code.gs`, `appsscript.json` and a README with every setup and deploy step. Paste and deploy; no build needed. |
| `prompts/01-apps-script-backend.md` | Prompt for the Google Apps Script that stores sign-ups in a Google Sheet and reports core team places left. Build this first. |
| `prompts/03-responsive-header-and-menu.md` | The header on tablets and phones (mark, "Join us", menu button), the full-screen menu, and hiding the header on scroll down and showing it on scroll up. Use on its own if the header is already built. |
| `prompts/04-update-hero-and-share-image.md` | Paste this if the build has already started: applies the new hero tagline and the social share image and text. |
| `prompts/02-nextjs-website.md` | Prompt for the Next.js website: architecture, single sources of truth for strings and design values, hooks, components, pages, forms and phases. |
| `rules/CLAUDE.md` | Standing rules. Copied to `Website/web/CLAUDE.md` for Claude Code. |
| `rules/sfm.mdc` | The same rules as a Cursor project rule, copied to `.cursor/rules/sfm.mdc` at the repository root. |
| `content/strings-master.md` | Every word on the site, taken from the approved design, page by page and section by section, plus the form errors, share messages and page titles the code needs. The source for `strings.ts`. |
| `content/website-copy.md` | The approved copy document, for voice and context. Where it differs, the strings master wins. |
| `design-reference/` | The approved design for every page, plus the shared header and the closing card and footer. Open the copy document for the master text. |
| `assets/brand/` | The original logo and mark files. Use as they are. |
| `assets/brand/pattern/` | The brand pattern: your original tile and swatches, plus see-through swatches made from the same shape. On the site it is used only on the dark closing card. |
| `assets/social/` | The image shown when the site is shared on WhatsApp, Facebook, LinkedIn and X (1200 by 630), and the HTML it was made from. |
| `assets/fonts/Nohemi-Bold.ttf` | The display typeface. |
| `assets/photos/` | Every photo used in the design, sized for the web, with `CREDITS.json` mapping each to its Unsplash original. |

## How to use it

This kit lives at `youkaristechnologies/Website/sfm-website-build-kit/`, beside the Next.js app in `Website/web/`.

1. Open the `youkaristechnologies` repository in Cursor or Claude Code.
2. Paste `prompts/02-nextjs-website.md` and let it work through phase 1 (setup). It works inside the existing `Website/web` app and copies the rules in.
3. The backend is already written in `Website/apps-script/`. Follow its README to create the Sheet, paste the code and deploy, while the website is being built.
4. Continue the website phases, reviewing after each one.

## Where the design and copy live

- Design canvas: "Strangers for Mary Landing Page" (Home, Our Story, Pray, Give, Gather, Build With Us).
- Copy: "Strangers for Mary Website Copy" document. The design reference files contain the same final text.
- Layout plan: "Strangers for Mary Website Layout Plan" document.
