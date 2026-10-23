# Prompt 2: The Strangers for Mary website in Next.js

Paste everything below the line into Claude Code or Cursor, opened at the repository root `youkaristechnologies/`. The website app already exists at `Website/web/` (created with `create-next-app`), and this kit sits beside it at `Website/sfm-website-build-kit/`. Work through the phases in order and stop at the end of each phase for review.

---

You are building the pre-launch website for **Strangers for Mary**, a worldwide network of Catholics who pray a full Rosary every day for one another's intentions, give through small acts of charity, and gather twice a year. The site invites people to join the network before the app (Youkaris) opens, and to apply for one of 20 places on the core team.

The design and every word of copy are already decided. Your job is to rebuild them exactly, as a maintainable Next.js codebase made of small reusable parts. Do not redesign, rewrite copy, or "improve" the look. When something is unclear, match the design reference; if it is still unclear, ask.

## 0. Where things are

```text
youkaristechnologies/            git repository root
└── Website/
    ├── web/                     the Next.js app (already created; build here)
    ├── apps-script/             the Google Apps Script backend (from prompt 1)
    └── sfm-website-build-kit/   this kit: prompts, rules, design reference, assets
```

The existing app uses **Next.js 16.4.2**, React 19.3, Tailwind CSS v4 (through `@tailwindcss/turbopack`), and `next.config.ts` turns on `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`. Keep that config. `Website/web/AGENTS.md` says this Next.js version has breaking changes: **read the relevant guides in `node_modules/next/dist/docs/` before writing routing, data fetching, caching or route handler code, and follow them over anything you remember.** Leave the generated block in `AGENTS.md` in place.

## 1. Inputs in `Website/sfm-website-build-kit/`

| Folder | What it is | How to use it |
| --- | --- | --- |
| `design-reference/*.html` | The approved design, one file per page plus the shared header and closing/footer. Written in a canvas markup format (`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{holes}}` filled from the script at the bottom of each file). | The source of truth for layout, spacing, colours, sizes, photos and every string. Read the inline styles as the spec. Do not copy the markup or inline styles into the app; translate them into components, SCSS modules and tokens. |
| `assets/brand/` | `sfm-logo-ink.svg` (full logo, for light grounds), `sfm-logo-lime-on-dark.svg` (full logo, for dark grounds), `sfm-mark-ink.svg` and `sfm-mark-lime.svg` (the chevron M mark alone). | Use these files as they are. **Never redraw, re-trace, re-colour, inline-edit or retype the logo or wordmark**, and never build it from text. Copy them to `public/brand/`. |
| `assets/brand/pattern/` | The brand pattern (the "Chain": the connected mark repeated in rows, each chevron nesting into the next). Originals: `sfm-pattern-tile.svg` (seamless repeat tile, ink on lime) and `sfm-pattern-ink.svg`, `sfm-pattern-lime.svg`, `sfm-pattern-blue.svg` (swatches). Web versions generated from the same shape: `sfm-pattern-strip-ink-on-lime.svg` (one row), `sfm-pattern-band-ink-on-lime.svg` (two rows), `sfm-pattern-swatch-ink.svg` and `sfm-pattern-swatch-lime.svg` (transparent background). | Use only these files. Never redraw or approximate the pattern. Copy to `public/brand/pattern/`. |
| `assets/fonts/Nohemi-Bold.ttf` | The display typeface (licensed). | Load with `next/font/local`. |
| `assets/photos/*.jpg` and `CREDITS.json` | Every photo the design uses, already sized for the web. | Copy to `public/images/`. Keep the credits file. |
| `prompts/01-apps-script-backend.md` | The backend contract. | The form API in this site must match it exactly. |

The master copy document is the "Strangers for Mary Website Copy" doc; the design reference files contain the same final text. If they ever disagree, stop and ask.

## 2. Stack

- The existing Next.js 16 app in `Website/web` (App Router, TypeScript strict). Do not run `create-next-app` again. Move the root `app/` folder into `src/app/`, point the `@/*` path alias at `./src/*`, and remove the starter page content and starter SVGs in `public/`.
- **SCSS modules are the primary styling system** (`sass`). Tailwind stays installed and is allowed only for simple layout utilities that map to our tokens (flex, grid, gap, display, visibility). No arbitrary Tailwind values (`w-[37px]`, `bg-[#…]`), and never mix Tailwind colour or spacing utilities into a component that has an SCSS module.
- `next/font` for Barlow and Barlow Condensed (Google) and Nohemi (local).
- `next/image` for every photo.
- `zod` for validation shared by the form and the API route.
- ESLint (Next config) plus `react/jsx-no-literals` so user-facing text cannot be hard-coded in JSX, and Stylelint (`stylelint-config-standard-scss`) with `color-no-hex` and `color-named: never` everywhere except the generated token files.
- Vitest and React Testing Library for unit tests.
- No other runtime dependencies without asking first.

## 3. Architecture

Follow a layered, feature-sliced structure. Imports only point **downward** (`app` → `views` → `widgets` → `features` → `entities` → `shared`); two items on the same layer never import each other. Next.js owns routing in `src/app`, so the route files stay thin, and the route-level composition layer is called `views` to avoid clashing with Next's reserved `pages` name.

```text
src/
├── app/                         Next.js routes only. Each page.tsx renders one view.
│   ├── layout.tsx               fonts, providers, <SiteHeader/>, metadata defaults
│   ├── page.tsx                 → <HomeView/>
│   ├── our-story/page.tsx       → <OurStoryView/>
│   ├── pray/page.tsx            → <PrayView/>
│   ├── give/page.tsx            → <GiveView/>
│   ├── gather/page.tsx          → <GatherView/>
│   ├── build-with-us/page.tsx   → <BuildWithUsView/>
│   ├── api/signup/route.ts      POST, validates and forwards to Apps Script
│   ├── api/places/route.ts      GET, places left (cached)
│   ├── icon.svg, sitemap.ts, robots.ts, not-found.tsx
├── core/                        app-wide setup (the FSD "app" layer)
│   ├── providers/               ThemeProvider, FontsProvider, StringsProvider
│   └── config/                  site config, env reading (server-only)
├── views/                       one folder per page, each with its own sections and styles
│   ├── Home/
│   │   ├── HomeView.tsx
│   │   ├── HomeView.module.scss
│   │   └── sections/
│   │       ├── HeroSection/          HeroSection.tsx + HeroSection.module.scss + index.ts
│   │       ├── ChallengeSection/
│   │       ├── WhoWeAreSection/
│   │       ├── DifferenceSection/
│   │       ├── PraySection/
│   │       ├── GiveSection/
│   │       ├── GatherSection/
│   │       ├── WhyStrangersSection/
│   │       ├── AmbitionSection/
│   │       ├── BuildBandSection/
│   │       └── JoinSection/
│   ├── OurStory/   (same pattern)
│   ├── Pray/
│   ├── Give/
│   ├── Gather/
│   └── BuildWithUs/
├── widgets/                     large blocks used on more than one page
│   ├── SiteHeader/  SiteFooter/  ClosingCard/  PathSwitcher/  JoinPanel/  PlacesBadge/
├── features/                    things a user does
│   ├── join-network/            form UI, form state, submit action
│   ├── apply-core-team/         Build With Us form
│   ├── share-network/           WhatsApp share link, copy-link button
│   └── show-places-left/        fetch + display of places left
├── entities/                    business objects
│   ├── signup/                  types, zod schema, mapping to the Apps Script payload
│   ├── core-team/               places model (total, filled, left, accepting)
│   └── team/                    the four teams (ids only; text comes from strings)
├── shared/                      app-agnostic building blocks
│   ├── ui/                      design-system components (list in section 6)
│   ├── hooks/                   useTheme, useFonts, useStrings, useBreakpoint
│   ├── lib/                     cn(), formatting, apps-script client (server-only)
│   └── types/
├── content/
│   └── strings.ts               THE single source of every user-facing string
└── styles/
    ├── tokens/
    │   ├── tokens.ts            THE single source of every design value
    │   ├── _tokens.generated.scss        generated, do not edit
    │   └── tailwind-theme.generated.css  generated, do not edit
    ├── abstracts/               _mixins.scss (breakpoints, type styles, focus ring), _functions.scss
    ├── base/                    _reset.scss, _typography.scss, _forms.scss
    └── globals.scss             imports base + generated tokens + Tailwind
```

Every component folder contains `Component.tsx`, `Component.module.scss` and `index.ts`, plus `Component.test.tsx` where it has logic. Server Components by default; add `"use client"` only where there is state or interaction (forms, accordion, copy button).

## 4. Single sources of truth

### 4.1 Strings: `src/content/strings.ts`

Every word a visitor can read lives here, including button labels, form labels, placeholders, error messages, alt text, page titles, meta descriptions and the WhatsApp share message. Structure it by page and section, typed `as const`:

```ts
export const strings = {
  site: { name: "Strangers for Mary", slogan: "PASS IT ON.", url: "https://www.strangersformary.org", email: "admin@strangersformary.org" },
  nav: { ourStory: "Our Story", pray: "Pray", give: "Give", gather: "Gather", build: "Build With Us", join: "Join the strangers" },
  home: {
    hero: { headline: "If you love Mary, you are already one of us.", headlineMuted: "Now take your place in the network.", body: "…", primaryCta: "Join the strangers", secondaryCta: "Help us build it", photoCard: "Every decade is a gift from one stranger to another.", limeCard: { label: "Mon to Sat", value: "1 Rosary", caption: "a day, for a different stranger" } },
    // …every section
  },
  // ourStory, pray, give, gather, buildWithUs, join, closing, footer, forms, errors, meta, images (alt text)
} as const;
```

- Two-tone headlines are stored as two keys (`headline`, `headlineMuted`), never as HTML.
- Strings with a number from the server use a function: `placesLeft: (left: number) => \`${left} of 20 places still open\``.
- Lists (the five "Not another prayer group" reasons, the four teams, the Pray steps, the Give steps, the FAQ) are arrays of objects in `strings.ts`.
- Components read strings through `useStrings()` (client) or by importing `strings` (server). Nothing else.
- Copy rules to keep when you transcribe: no em dashes anywhere, no exclamation marks in headlines, the word "pillar" never appears, Strangers for Mary is a "network" and never a "family", "Rosary" is capitalised. Add a unit test that fails if any string contains an em dash or the word "pillar".

### 4.2 Design values: `src/styles/tokens/tokens.ts`

Every colour, font, size, space, radius, shadow and breakpoint is defined once here. A script `scripts/build-tokens.ts` (run with `tsx` on `predev` and `prebuild`) generates:

1. `_tokens.generated.scss`: CSS custom properties on `:root` (for example `--color-lime`, `--space-6`, `--radius-xl`, `--font-display`) plus SCSS maps for mixins.
2. `tailwind-theme.generated.css`: the Tailwind v4 `@theme` block (the app uses Tailwind v4), so any Tailwind utility uses the same tokens.

SCSS modules only ever use `var(--…)` or the mixins. Hex values, raw pixel sizes for spacing, and raw media queries are not allowed outside the tokens folder.

Start `tokens.ts` with the values the design uses:

| Group | Token | Value | Use |
| --- | --- | --- | --- |
| Brand | lime | `#D1FF42` | One large lime element per screen, primary buttons, tags, highlighted words. Never as text on light grounds |
| Brand | limeDeep | `#C2F032` | Decorative circle on lime cards |
| Brand | ink | `#0A0F1A` | Text, dark buttons, the one dark closing card |
| Brand | inkRaised | `#141B2B` | Raised surfaces on ink |
| Brand | blue | `#0251B0` | Links, small pills, numbers, the second line of the slogan |
| Brand | mist | `#C7D1DD` | Borders and hairlines on light grounds |
| Neutral | paper | `#F7F8F5` | Page background |
| Neutral | white | `#FFFFFF` | Cards |
| Neutral | mistTint | `#EEF1F4` | Soft panels, closing band, form panel |
| Neutral | hairline | `#DDE2E8` | Card borders, dividers |
| Neutral | inkBorder | `#2A3346` | Borders on ink |
| Text | primary | `#0A0F1A` | |
| Text | body | `#4A5468` | Body copy on light grounds |
| Text | longform | `#2E3748` | Our Story reading column |
| Text | muted | `#8A94A6` | Second clause of two-tone headlines only (large text) |
| Text | placeholder | `#6B7488` | Input placeholders and underlines |
| Text | onDarkMuted | `#A3AEC0` | |
| Font | display | Nohemi Bold 700 | All headlines, big numbers. Sentence case. Tracking −0.02em to −0.04em |
| Font | body | Barlow 400/500/600/700 | Body, buttons, form text |
| Font | label | Barlow Condensed 500/600/700/800 | Uppercase labels and tags (tracking 1.5px), small numbers |
| Type | display-xl | `clamp(44px, 6vw, 84px)` / line-height 1 | Page headlines |
| Type | display-l | `clamp(36px, 4.8vw, 68px)` / 1.04 | Statements (ambition, who we are) |
| Type | heading-l | `clamp(36px, 4.4vw, 60px)` / 1.02 | Section headings |
| Type | heading-m | `clamp(32px, 3.6vw, 48px)` / 1.05 | Sub-section headings |
| Type | card-title | `26px`–`44px` (see reference) | Card headings |
| Type | lead | `18px`–`20px` / 1.6 | Lead paragraphs |
| Type | body | `16px`–`17px` / 1.6 | Body |
| Type | small | `14px`–`15px` | Captions, labels |
| Space | 1–12 | 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72 px | |
| Space | section | `clamp(96px, 12vw, 160px)` | Gap between sections |
| Space | sectionLarge | `clamp(112px, 14vw, 184px)` | Before statements and closes |
| Radius | sm, md, lg, xl, 2xl, pill | 12, 16, 20, 24, 28, 999 px | |
| Shadow | float | `0 24px 48px rgba(10,15,26,0.08)` | Cards overlapping photos |
| Layout | container | max 1200px, side padding 24px | |
| Breakpoints | tablet, laptop, desktop, wide | 640, 1024, 1280, 1536 px | Mobile-first |

Check the reference files for any value not in this table and add it as a token rather than hard-coding it.

### 4.3 Hooks

- `useTheme()` returns the typed tokens object (`colors`, `space`, `radius`, `shadow`, `breakpoints`, `layout`) from `ThemeProvider`, for the rare cases JavaScript needs a value (SVG strokes, canvas, inline image `sizes`).
- `useFonts()` returns `{ display, body, label }`, each with the `next/font` `className`, `variable` and `family`, plus the type scale, from `FontsProvider`.
- `useStrings()` returns `strings` from `StringsProvider` (ready for translation later).
- `useBreakpoint()` returns the current breakpoint name from the token values.

Styling itself still happens in SCSS modules via CSS variables; the hooks are for JavaScript access, not a replacement for stylesheets.

## 5. Design rules to keep

- The page sits on neutrals (paper, white, mistTint). Colour lives on a few elements, never on whole full-width bands. Per screen: at most one large lime element, small lime touches, and one ink card per page (the closing card).
- Sections are separated by space, not by colour. Cards and photos have large rounded corners; buttons and tags are fully round.
- Headlines are two-tone: main clause in ink, second clause in `muted`.
- Primary button: lime pill with an ink circle holding a lime arrow. Secondary: text link with a lime underline. Dark button: ink pill with a lime arrow circle.
- Photos are large, rounded, never colour-tinted; small things float on them (white chip, frosted glass card, lime folder-tab card).
- **Brand pattern:** used in exactly one place, the dark "Now pass it on." closing card on every page, where the lime pattern (`public/brand/pattern/sfm-pattern-swatch-lime.svg`) covers the whole card at 10% opacity behind the content. Nowhere else: no header strip, no footer band, no section backgrounds, no overlays on lime panels.
- The folder-tab card (a short tab on the top-left edge) is a signature shape, used for the hero lime card, the path switcher cards and the team cards.
- **Logo rules:** the logo is always the supplied SVG, the mark always the supplied mark SVG. Where the slogan "PASS IT ON." sits next to the logo or mark (footer, Our Story mark card), it is set in Barlow Condensed 500, uppercase, letter-spacing 5–6px, never in the logo's Nohemi Bold. The large "Now pass it on." in the closing card stays Nohemi Bold, because it is a headline, not part of the logo lockup.
- Mobile-first. Every row of cards stacks on phones in reading order; cards that overlap photos on desktop sit under the photo on phones; touch targets at least 44px.
- Accessibility: semantic landmarks, one `h1` per page, real `<button>`, `<a>`, `<label>`, `<fieldset>`/`<legend>` for checkbox groups, visible focus ring (2px blue), descriptive alt text from `strings`, decorative images `alt=""`, `prefers-reduced-motion` respected, contrast checked.

## 6. Shared UI components (`src/shared/ui`)

Build these first, each with props typed and documented, and a short usage example in a comment or Storybook-free demo route `/dev/ui` (not linked, excluded from the sitemap and blocked in production):

`Container`, `Section` (spacing variants), `Stack`, `Grid`, `Heading` (levels, sizes, `muted` second clause support), `Text` (lead, body, small, longform), `Label` (uppercase tag text), `Tag` (pill: white with blue dot, lime, ink, blue), `Button` (variants: primary lime with arrow, dark, outline, ghost; sizes; renders `<a>` or `<button>`), `ArrowLink` (text link with lime underline and arrow), `ArrowIcon`, `Icon` (line icons, 2px stroke, square caps), `Logo` (variant: ink or lime-on-dark; size), `Mark` (ink or lime),  `Photo` (wraps `next/image`, rounded, aspect or height, object position), `PhotoWithOverlay` (slots for chips and cards on top of a photo), `FrostedCard`, `FolderCard` (folder-tab card in lime, white or ink), `NumberCard` (big number, label, caption), `StatementBlock` (centred two-tone statement with optional label and closing line), `SplitHeader` (heading left, short text right), `NumberedList` (the step lists), `PhotoStrip` (lime-framed row of photos), `PhotoMosaic` (alternating photo and text tiles), `Accordion` (FAQ, uses `<details>`), `PullLine`, `Counter` (the places pill), `FormField` (underlined input with label and error), `TextArea`, `Checkbox`, `CheckboxGroup`, `SuccessState`.

Page sections are compositions of these. If a section needs something new and reusable, add it here; if it is unique to one page, keep it in that page's `sections/` folder.

## 7. Pages

Rebuild each page section by section from its reference file, in order. The headings below map to the HTML comments in the reference files.

- **Home** (`home.html`): Opening, The challenge, Who we are, What makes us different, We pray, We give, We gather, Why strangers, Our ambition, Build with us (lime band with places counter), Join (form), then the shared closing card and footer.
- **Our Story** (`our-story.html`): Opening, wide photo, What we saw, Sunday/Monday photo pair, What we knew (pull quote and photo), Ten friends (photo and number cards), When it broke, Why we are back, Name and mark, Close.
- **Pray** (`pray.html`): Opening, Your week as a stranger (day strip with Sunday Mass card, five steps, photo strip), Cana / thank-you / habit blocks with photos, Our ambition, Youkaris (phone illustration built in code), Questions (accordion with photo), Close, Path switcher (Give, Gather).
- **Give** (`give.html`): Opening, Worked for then given, How a gift travels (five joined steps), Who we give to, Our ambition, Close, Path switcher.
- **Gather** (`gather.html`): Opening, A room full of Pauls, What happens when we gather (mosaic), Why we gather, How often (big "2"), Something to look forward to, Close, Path switcher.
- **Build With Us** (`build-with-us.html`): Opening with lime "20 places / X still open" card, team photo with places pill, Twenty places, Why now, Four teams (photo cards), Application form (lime panel), Close.
- **Shared**: `SiteHeader` (`_shared-site-header.html`) and `ClosingCard` + `SiteFooter` (`_shared-closing-and-footer.html`) appear on every page from `app/layout.tsx` or the views.

## 8. Forms and data

Both forms post to `/api/signup`, which forwards to the Apps Script web app described in `prompts/01-apps-script-backend.md`.

- **Home form (`join-network`)**: Full name, Baptism name, Email, Your parish, City and country, WhatsApp (optional). Checkboxes: "Join as a stranger" (ticked by default) and "Apply for the core team". Ticking the second reveals: the places-left line and interview note, team checkboxes (Stranger Relations, Outreach, Core and Content, Technology), and "Tell us about yourself". Button "Count me in". Success state: "Welcome, stranger." with Share on WhatsApp and "Sign up someone else".
- **Build With Us form (`apply-core-team`)**: same fields, `applyCoreTeam` always true, team checkboxes and about shown, a "Also invite me to join as a stranger" checkbox ticked by default, button "Apply for a place", places line under the button. Success: "Thank you for applying."
- One zod schema in `entities/signup/model/schema.ts` drives client validation, server validation and the TypeScript types. Field errors show under each field using strings from `strings.forms.errors`.
- Hidden honeypot field (`website`); if filled, return success without forwarding.
- `/api/signup` route: parse and validate, basic per-IP rate limit (in memory, 5 per minute), add `submittedAt`, call the Apps Script client in `shared/lib/appsScript.ts` (server-only, reads `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET`, follows redirects, 10 second timeout), map backend errors to friendly strings, never expose the secret or raw errors.
- `/api/places`: calls `action=places`, cached for 5 minutes using the caching API this Next.js version documents with `cacheComponents` on (check `node_modules/next/dist/docs/`). The places counter (`show-places-left`) renders the live number. If the backend is unreachable, hide the number rather than show a guess. When `left` is 0 or `accepting` is false, the counter says the core team is complete and the apply option is disabled (add these strings).
- Share: WhatsApp link with the share message from `strings` (`https://wa.me/?text=…` URL-encoded) and a copy-link button with a "Link copied" state.
- `.env.example` lists `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## 9. Quality bar

- TypeScript strict, no `any`. Lint and Stylelint clean.
- Tests: schema tests, strings test (no em dashes, no "pillar"), API route tests with the Apps Script client mocked, and component tests for the form (reveal on tick, validation messages, success state), Accordion and Button.
- Lighthouse on mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100. Hero photo uses `priority`; all images have correct `sizes`.
- Metadata per page from `strings.meta` (title, description, Open Graph image from the page's hero photo). `sitemap.ts` and `robots.ts`. Favicon from `sfm-mark-ink.svg` as `app/icon.svg`.
- A `README.md` explaining the structure, the two sources of truth, how to add a section, how to add a string, how to change a token, and how to run, test and deploy.
- `Website/web/CLAUDE.md` (from `rules/CLAUDE.md`, which also points to `AGENTS.md`) and `.cursor/rules/sfm.mdc` at the repository root (from `rules/sfm.mdc`), so every later session follows them.

## 10. Phases (stop for review after each)

1. **Setup**: in the existing `Website/web` app, read the Next.js 16 docs in `node_modules/next/dist/docs/`, move `app/` into `src/app/`, install and configure SCSS, ESLint rules, Stylelint and Vitest, keep Tailwind v4 and the current `next.config.ts`, copy assets into `public/`, add `CLAUDE.md` and the Cursor rule, and create the folder structure. Commit on a new branch.
2. **Tokens, fonts and hooks**: `tokens.ts`, the generator script, generated files, global styles, mixins, providers and the four hooks. Show a token preview on `/dev/ui`.
3. **Strings**: transcribe every string from all reference files into `strings.ts`, in page order, with the strings test passing. List any text you were unsure how to key.
4. **Shared UI**: every component in section 6 with tests where they have logic, shown on `/dev/ui`.
5. **Widgets**: SiteHeader, ClosingCard, SiteFooter, PathSwitcher, JoinPanel, PlacesBadge.
6. **Home page**, then compare it side by side with `home.html` at 390px, 768px, 1280px and 1440px widths and fix every difference.
7. **The other five pages**, same comparison for each.
8. **Forms and API**: entities, features, both routes, wired to a mocked backend first, then to the real Apps Script URL.
9. **Quality pass**: accessibility, Lighthouse, tests, README.

At the end of each phase, report what you built, anything you deviated from and why, and open questions.
