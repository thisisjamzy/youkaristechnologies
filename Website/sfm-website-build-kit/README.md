# Strangers for Mary website build kit

Everything Claude Code or Cursor needs to build the pre-launch website exactly as designed.

## What is inside

| Path | What it is |
| --- | --- |
| `../apps-script/` (in `Website/apps-script/`) | The finished backend, version 2: `Code.gs`, `appsscript.json` and a README with every setup, upgrade and deploy step. Stores Home sign-ups and role applications, and saves CVs to a private Drive folder. Paste and deploy; no build needed. |
| `prompts/01-apps-script-backend.md` | The original prompt for the version 1 backend. Kept for history: the finished version 2 is already in `Website/apps-script/`. |
| `prompts/03-responsive-header-and-menu.md` | The header on tablets and phones (mark, "Join us", menu button), the full-screen menu, and hiding the header on scroll down and showing it on scroll up. Use on its own if the header is already built. |
| `prompts/04-update-hero-and-share-image.md` | Paste this if the build has already started: applies the new hero tagline and the social share image and text. |
| `prompts/05-volunteer-roles-and-applications.md` | **Use this next.** Renames Build With Us to Volunteer, adds the Roles page with one application per role (questions, CV upload, confirmations), updates Home, widens the layout and turns the second half of headlines blue. Deploy the version 2 backend first. |
| `prompts/02-nextjs-website.md` | Prompt for the Next.js website: architecture, single sources of truth for strings and design values, hooks, components, pages, forms and phases. |
| `rules/CLAUDE.md` | Standing rules. Copied to `Website/web/CLAUDE.md` for Claude Code. |
| `rules/sfm.mdc` | The same rules as a Cursor project rule, copied to `.cursor/rules/sfm.mdc` at the repository root. |
| `content/strings-master.md` | Every word on the site, taken from the approved design, page by page and section by section, plus the form errors, share messages and page titles the code needs. The source for `strings.ts`. |
| `content/roles.json` | The 19 volunteer roles open to application (the Core and Content Lead is appointed and never listed), with the team description, the full role text, the three application questions and the PDF path for each, plus the six "nature of the work" items. The source for `src/content/roles.ts`. |
| `content/website-copy.md` | The approved copy document, for voice and context. Where it differs, the strings master wins. |
| `design-reference/` | The approved design for every page, plus the shared header and the closing card and footer. `volunteer.html` and `roles.html` are new; `build-with-us.html` is obsolete and kept only for history. |
| `assets/brand/` | The original logo and mark files. Use as they are. |
| `assets/brand/pattern/` | The brand pattern: your original tile and swatches, plus see-through swatches made from the same shape. On the site it is used only on the dark closing card. |
| `assets/social/` | The image shown when the site is shared on WhatsApp, Facebook, LinkedIn and X (1200 by 630), and the HTML it was made from. |
| `assets/roles/*.pdf` | One description per role, named by role id, for the "Download PDF" buttons. There is deliberately no combined PDF of all roles. |
| `assets/fonts/Nohemi-Bold.ttf` | The display typeface. |
| `assets/photos/` | Every photo used on the site, sized for the web. All of them come from `Strangers For Mary/Stock Images`; `CREDITS.json` lists the source file (`image N.jpg`) for each. |

## How to use it

This kit lives at `youkaristechnologies/Website/sfm-website-build-kit/`, beside the Next.js app in `Website/web/`.

1. Open the `youkaristechnologies` repository in Cursor or Claude Code.
2. Paste `prompts/02-nextjs-website.md` and let it work through phase 1 (setup). It works inside the existing `Website/web` app and copies the rules in.
3. The backend is already written in `Website/apps-script/`. Follow its README to create the Sheet, paste the code and deploy, while the website is being built.
4. Continue the website phases, reviewing after each one.

## Where the design and copy live

- Design canvas: "Strangers for Mary Landing Page" (Home, Our Story, Pray, Give, Gather, Volunteer, Volunteer Roles).
- Copy: "Strangers for Mary Website Copy" document. The design reference files contain the same final text.
- Layout plan: "Strangers for Mary Website Layout Plan" document.

## Latest update (November 2026)

1. Upgrade the backend: follow "Upgrade an existing deployment" in `Website/apps-script/README.md`.
2. Paste `prompts/05-volunteer-roles-and-applications.md` into Claude Code or Cursor at the repository root and review after each phase.
