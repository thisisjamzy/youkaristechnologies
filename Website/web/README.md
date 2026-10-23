# Strangers for Mary website

The pre-launch website for Strangers for Mary: six pages, a sign-up form and a core team application, built with Next.js 16 (App Router), React 19, SCSS modules and TypeScript.

The design and every word of copy come from the build kit in `../sfm-website-build-kit/`. Rules for every change are in [`CLAUDE.md`](CLAUDE.md) (and `.cursor/rules/sfm.mdc` at the repository root).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 (regenerates the tokens first)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server. Also serves the internal preview at `/dev/ui`. |
| `npm run build` / `npm start` | Production build and server. |
| `npm run test` | Vitest: strings, schema, API routes, components, every page against the strings master. |
| `npm run lint` | ESLint, including "no text in JSX" and the layer import rules. |
| `npm run lint:styles` | Stylelint: no hex or named colours outside the token files. |
| `npm run typecheck` | TypeScript, strict. |
| `npm run tokens` | Regenerates the CSS variables and Tailwind theme from `tokens.ts`. |

Before finishing any change, `lint`, `lint:styles`, `test` and `build` must pass.

## The two sources of truth

**Every word** a visitor can read lives in [`src/content/strings.ts`](src/content/strings.ts), transcribed from `../sfm-website-build-kit/content/strings-master.md`. `strings.test.ts` checks that every line of the master is there, that nothing is invented, and the copy rules (no em dashes, no "pillar", no exclamation marks in headlines). `src/app/pages.test.tsx` renders every page and checks each line of the master appears on it.

**Every design value** (colours, fonts, sizes, spacing, radii, shadows, breakpoints, motion) lives in [`src/styles/tokens/tokens.ts`](src/styles/tokens/tokens.ts). `npm run tokens` generates `_tokens.generated.scss` (CSS variables plus SCSS maps) and `tailwind-theme.generated.css`. Never edit the generated files.

## How the code is organised

```text
src/
├── app/         routes only: each page.tsx renders one view; api/signup, api/places
├── core/        app-wide providers
├── views/       one folder per page, with its sections in views/<Page>/sections/
├── widgets/     large blocks used on several pages: SiteHeader, ClosingCard, SiteFooter,
│                PathSwitcher, PathClose, JoinPanel, PlacesBadge
├── features/    things people do: join-network, apply-core-team, share-network, show-places-left
├── entities/    business objects: signup (schema, payload), core-team (places), team (ids)
├── shared/      ui (design-system components), hooks, lib (helpers, Apps Script client), types
├── content/     strings.ts
└── styles/      tokens, abstracts (functions and mixins), base styles, fonts
```

Imports only point down: `app → views → widgets → features → entities → shared`, and two items on the same layer never import each other. ESLint enforces this.

Every component folder has `Component.tsx`, `Component.module.scss` and `index.ts`. Components are Server Components unless they need state (`"use client"`).

### Add a section to a page

1. Create `src/views/<Page>/sections/<Name>Section/` with `<Name>Section.tsx`, `<Name>Section.module.scss` and `index.ts`.
2. Build it from `src/shared/ui` components (`Section`, `Heading`, `Text`, `Photo`, ...). If two pages need the same piece, move it to `shared/ui` (or `widgets` if it is large).
3. Add it to `src/views/<Page>/<Page>View.tsx` in the order of the design reference.
4. Compare it with `../sfm-website-build-kit/design-reference/<page>.html` at 390, 768, 1280 and 1440px.

### Add or change a string

1. Change the line in `strings-master.md` first (it is the master), then the same text in `strings.ts`.
2. Components read strings by importing `strings` (server) or with `useStrings()` (client). Never type text in JSX: ESLint rejects it.
3. `npm run test` tells you if the two disagree.

### Change a design value

1. Edit `src/styles/tokens/tokens.ts`.
2. `npm run tokens` (also runs before `dev`, `build` and `test`).
3. In SCSS modules, start with `@use "@/styles/abstracts" as *;` and use the functions and mixins: `space(6)`, `radius(xl)`, `color(lime)`, `@include up(laptop)`, `@include display(heading-l)`. An unknown token name fails the build. Always import through `@/styles/...`: Turbopack does not watch files reached through Sass load paths.

Spacing is on a 4px unit: `space(6)` is 24px. Gap steps (up to 120px) are for padding and gaps; box steps (110px and up) are for photo heights, card minimums and grid columns.

## Forms and the backend

Both forms post to `/api/signup`, which validates with the shared zod schema (`entities/signup`), applies a honeypot and a rate limit (5 a minute per address), and forwards to the Google Apps Script web app in `../apps-script/` through a server-only client. The secret never reaches the browser. `/api/places` and the pages read the core team places through a cached helper (5 minutes); a core team application refreshes it.

To connect the real backend, follow `../apps-script/README.md`, then copy `.env.example` to **`.env.local`** and fill in `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET`. Keep real values out of `.env.example`: it is committed, and a test fails if it holds a value.

Without those two variables, development uses an in-memory mock backend (`shared/lib/appsScriptMock.ts`). Put `+full` or `+error` in an email to see the "team full" and "server error" replies. In production, a missing variable is treated as an outage: the places number hides and sign-ups get the friendly error.

## Deploy

Any Node host that runs `next start` works (for example Vercel). Set `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET` and `NEXT_PUBLIC_SITE_URL` in the host's environment variables. Before launch, replace the `#` placeholders in `src/shared/lib/routes.ts` (Instagram, WhatsApp channel, privacy policy).

## Internal preview

`/dev/ui` shows every shared component and token with real copy. It only exists under `npm run dev` (`page.dev.tsx`, see `pageExtensions` in `next.config.ts`), so it is never part of a production build.
