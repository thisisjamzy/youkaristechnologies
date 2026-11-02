# Prompt 5: Volunteer page, role descriptions, role-specific applications and the wider layout

Paste everything below the line into Claude Code or Cursor, opened at the repository root `youkaristechnologies/`. Before you start, deploy the new backend: follow "Upgrade an existing deployment" in `Website/apps-script/README.md` (version 2 adds the `apply` action and saves CVs to Drive). The website URL and secret do not change.

---

The build kit in `Website/sfm-website-build-kit/` has been updated. Apply these changes to `Website/web/`, following `Website/web/CLAUDE.md` and the architecture you already set up (feature-sliced folders, SCSS modules first, `strings.ts` and `tokens.ts` as the single sources of truth). Work through the phases in order, run lint, tests and build at the end of each phase, commit on a new branch `volunteer-roles`, and stop for review after each phase.

## What changed, in one paragraph

"Build With Us" becomes **Volunteer**. The page no longer counts open places or presents the team as a launch opportunity; it is written to stay true for years. A new **Roles** page lists 19 volunteer roles in four teams, each with a full description, a downloadable PDF and its own application form with three behavioural questions, a CV upload and three required confirmations, including that the role is unpaid and not full-time. The Core and Content Lead is appointed by the Network Custodian and is never listed or applied for. The general "apply for the core team" checkbox and team picker are gone from Home. Across the whole site the page container is wider and the second half of every two-tone headline is Elite Blue instead of grey.

## Sources (in this order of authority)

| File | Use |
| --- | --- |
| `design-reference/volunteer.html` | The new Volunteer page. Replaces `build-with-us.html`, which is obsolete. |
| `design-reference/roles.html` | The new Roles page, including the application form and its states. |
| `design-reference/home.html` | Home, updated. Compare it with the current Home page section by section and apply every difference in text and structure, not only the ones listed below. |
| `design-reference/_shared-site-header.html`, `_shared-closing-and-footer.html` | Updated nav and footer links. |
| `content/roles.json` | The 19 roles: titles, team, team description, summary, the role paragraph, responsibilities, requirements, reports to, PDF path, the three application questions and the link field. Also the six "nature of the work" items. This is data, not copy to retype: import it. |
| `content/strings-master.md` | Every other word: the "Volunteer" and "Roles" sections, the updated header, footer and Home sections, and "Added for the build" (form errors, metadata). Where the design reference and the strings master disagree, the design reference wins; fix the strings master in the same commit. |
| `assets/roles/*.pdf` | One PDF per role, named by role id. |
| `../apps-script/README.md` | The backend contract for `signup` and `apply`. |

## Phase 1: Global design changes

1. **Wider container.** The page container is now `max-width: max(1200px, 80vw)` with the same 24px side padding (the design reference uses this on every section, the header and the footer). Change the `container` token in `tokens.ts` and the SCSS variable it feeds; do not hard-code it in components. Pages built before this change (Pray, Give, Gather, Our Story) pick it up through the shared `Container`.
2. **Two-tone headlines are blue.** The second clause of every two-tone headline (and the standalone large "muted" lines such as "Every decade is a gift…") changes from `#8A94A6` to Elite Blue `#0251B0`. Add a token `color.text.accent = #0251B0`, point the `Heading` component's second-clause style at it, and keep `muted` (`#8A94A6`) only where the design still uses it: the second line inside the dark closing card ("We pray. We give. We gather."), where blue would not be readable. Search for every use of the muted token and confirm each one against the design reference.
3. Update `Website/web/CLAUDE.md` and `.cursor/rules/sfm.mdc` to say "second clause Elite Blue" (the kit's `rules/` files already say this).
4. Check 320, 390, 768, 1280, 1440 and 1920px. At 1440px nothing visibly changes (80vw is narrower than 1200px there); at 1920px the content is 1536px wide.

## Phase 2: Rename Build With Us to Volunteer

1. Move the route to `/volunteer` (`src/app/volunteer/page.tsx` rendering `VolunteerView`). Add a permanent redirect from `/build-with-us` to `/volunteer` using the redirect mechanism this Next.js version documents in `node_modules/next/dist/docs/`.
2. Header, full-screen menu and footer: "Build With Us" becomes **Volunteer**. The footer's "Get involved" column gains **Volunteer roles** linking to `/volunteer/roles`. Update `strings.common.nav` and the footer strings.
3. Sitemap: replace `/build-with-us` with `/volunteer` and `/volunteer/roles`. Metadata for both pages is in the strings master.
4. Rebuild the page from `design-reference/volunteer.html`: Opening (tag "Volunteer", two-tone headline, paragraph, "See the volunteer roles" button, lime card "Volunteering, not a job"), full-width photo with **no** places pill, "Why volunteer" (centred), "Four teams" (photo cards; each card links to `/volunteer/roles#roles`; the footer of each card says "See the roles"), "How to volunteer" (four numbered steps in a grid, button to the roles) and the closing line.
5. Delete what no longer exists: the places counter everywhere (`PlacesBadge`, `show-places-left`, `entities/core-team` places model, `/api/places` and its cache), the "Twenty places" and "Why now" sections, and the Build With Us application form (`features/apply-core-team`). Remove their strings and tests. Search the codebase for `places`, `spotsLeft`, `core_team_full` and `build-with-us` afterwards; nothing should remain except the redirect.

## Phase 3: Home changes

Apply every difference between the current Home page and `design-reference/home.html`. The ones that matter for logic:

- **"Bring them together" band:** the counter is gone. The text is "Strangers for Mary is built and carried by volunteers. Find the role that fits your gifts and apply for it." followed by a "See the volunteer roles" link to `/volunteer/roles`. The square arrow button links to `/volunteer` with the aria label "Volunteer with us". The hero's secondary link is now "Volunteer with us".
- **Join form (`features/join-network`):** fields are Baptism name, Phone number (required, with country code), Your parish, City and country, and Email (optional). There is no full name, no WhatsApp field, no "Apply for the core team" checkbox and no team picker. The "I want to" group keeps only "Join as a stranger" (ticked). Under it: "Want to volunteer? Each role has its own application. See the volunteer roles" with the link to `/volunteer/roles`.
- **Payload to `/api/signup`:** `{ action: "signup", sourcePage: "home", baptismName, phone, parish, city, email, joinAsStranger: true }`. Update the zod schema, `payload.ts`, `response.ts`, the error messages (phone required, phone not valid, email not valid only when filled) and the tests. Remove `applyCoreTeam`, `teams`, `about`, `fullName` and `whatsapp` from the client entirely.
- Other text changes in the reference (the definition paragraph, the "We give" paragraph, the six reasons, the gathering now once a year on the last Saturday of October, the join paragraph) come across as strings.

## Phase 4: The Roles page

Route: `/volunteer/roles`, rendering `RolesView`. Build it from `design-reference/roles.html`.

### Data

- Copy `content/roles.json` to `src/content/roles.ts` as a typed, readonly constant (`as const` plus a `Role` type in `entities/role/model`). The page, the form and the API route all read from it. Do not move role text into `strings.ts`; page chrome (headings, labels, buttons, errors) stays in `strings.ts`.
- Copy `assets/roles/*.pdf` to `public/roles/`. Each role's `pdf` field points there. There is deliberately **no** combined PDF of all roles: never add one.

### Sections

1. **Opening:** tag "Volunteer · Roles" linking to `/volunteer`, two-tone headline "Read the role. / Then apply for it.", paragraph, one lime button "See the roles" (scrolls to `#roles`), and the lime folder-tab card "Before you apply / Every role is unpaid. None is full-time." with a link to `#nature`.
2. **Nature of the work** (`#nature`): heading "Volunteering, / not a job.", paragraph, then the six items from `roles.json` `nature` in a white rounded panel, three columns on wide screens, each with a 3px lime top rule. This content must be present and readable: it is how we make sure nobody mistakes a role for paid or full-time work.
3. **Who we look for:** three cards exactly as designed (two white, one ink).
4. **The roles** (`#roles`): two-tone heading, paragraph, then a filter row of pill buttons: All roles, Core and Content, Technology, Stranger Relations, Outreach (`aria-pressed`, ink when active). The filter state lives in the URL as `?team=` so a filtered view can be shared, and defaults to All. Below, a responsive grid of **role cards** (minimum column 340px), all white, with the folder tab:
   - Team name only (uppercase label, Elite Blue). **No** extra descriptors, **no** tags (no "Team lead", "Pivotal role", "Training provided" or "Experience required" on the cards).
   - Title (Nohemi), summary.
   - A disclosure "Read the full role" / "Show less" with a plus icon that rotates to a cross. Inside, in order: "The team" + the team description, "The role" + the role paragraph, "What you will do" + responsibilities, "You will need" + requirements (lists with the blue chevron), "Reports to: …". Use a native `<details>`/`<summary>` or an accessible disclosure button; it must work with the keyboard and announce its state.
   - Two buttons: "Download PDF" (outline, `download` attribute) and "Apply for this role" (lime).
5. **Application** (`#apply`): white panel with two columns that stack below about 900px.
   - Left: heading "Apply for / one role.", paragraph, the chosen role's summary card (team, title, summary, "Download the role description") when a role is chosen, and the note "This is not a paid job. …".
   - Right (grey `#EEF1F4` panel): the form.
6. Closing line "Do not just join the strangers. / Bring them together." and the shared closing card and footer.

### Choosing a role

- "Apply for this role" sets the selected role and scrolls to `#apply`, moving focus to the form heading. It also updates the URL to `?role=<id>#apply` so the link can be shared; opening that URL preselects the role.
- The role dropdown in the form lists all 19 roles as "Title (Team)". Changing it swaps the three questions and the link field.

### The form (`features/apply-for-role`)

Fields, top to bottom (labels and placeholders in the strings master):

1. **The role you are applying for** (select, required).
2. **Full name** and **Baptism name** (two columns).
3. **Phone number** (required, with country code) and **Email** (required).
4. **Your parish** and **City and country**.
5. When a role is chosen: the label "Questions for this role", then the role's three questions as required textareas (3 rows, max 3000 characters each, with a live character count only after 2500), then the role's link field (`url` input, label from `linkLabel`; required only when `linkRequired` is true, which today is only the Brand and Graphic Designer's portfolio). With no role chosen, show "Choose a role above to see the questions for that role." instead.
6. **Your CV:** required. PDF, DOC or DOCX, at most 4 MB.
7. **Besides Sunday, how much time can you give in a typical week?** (select, required): Up to 3 hours, 4 to 6 hours, 7 hours or more.
8. **Please confirm** (fieldset): three required checkboxes, "I understand this is an unpaid volunteer role. It is not a job and not full-time, and there is no salary, allowance or payment of any kind.", "I can keep Sunday for the network, after Holy Mass.", "I pray the Rosary daily, or I am ready to begin."; and one optional checkbox ticked by default, "Also invite me to join the network as a stranger."
9. **Send my application** button, then the privacy line.

Styling (all from tokens, all in the SCSS module):

- Every text input, textarea and select is a **white box**: background `#FFFFFF`, 1.5px border `#DDE2E8`, radius 14px, padding 12px 16px, min height 52px, Barlow 17px, ink text, focus ring 2px Elite Blue with 3px offset. Error state: border and message in the error colour already in `tokens.ts`.
- **Selects** use `appearance: none` with a custom indicator inside the right edge: a 36px lime circle holding an ink chevron (inline SVG, `aria-hidden`), not the browser's arrow. Build a reusable `Select` in `shared/ui`.
- **The CV field** is a reusable `FileInput` in `shared/ui`: a white box with a 1.5px dashed `#C7D1DD` border, an ink pill button with a lime upload icon ("Upload your CV", becoming "Change file" once chosen), and the chosen file name beside it (muted "No file chosen yet" before). The real `<input type="file">` stays in the DOM, visually hidden but focusable, and the whole box is its label, so keyboard, screen readers and native validation all work. Show the hint "PDF or Word document" under it.
- Checkboxes keep the ink `accent-color` as on the Home form.

Validation (one zod schema in `entities/role-application/model`, used on the client and again in the route):

- Required fields as above; email and phone formats as on Home; answers 1 to 3000 characters; links must start with `http://` or `https://`; CV type by extension and MIME type, size at most 4 MB; the three confirmations must be `true`; `roleId` must be one of the 19 ids.
- Error messages are in the strings master ("Form errors and states", application section). Show them under each field and move focus to the first invalid field on submit.

Submitting:

- The client sends `multipart/form-data` to `POST /api/apply` (never the CV as base64 from the browser).
- `src/app/api/apply/route.ts` (Node runtime): parse the form data, validate with the same schema, check the file's first bytes really are a PDF (`%PDF`), DOCX (`PK`) or DOC (`D0 CF 11 E0`), apply the same rate limit as `/api/signup`, look up the role in `roles.ts` and attach its three **question texts from the server's copy** (never trust question text from the client), base64-encode the file and POST `{ secret, action: "apply", sourcePage: "roles", roleId, questions, answers: { q1, q2, q3 }, fullName, baptismName, phone, email, parish, city, links, hours, confirmUnpaid, confirmSunday, confirmRosary, joinAsStranger, cv: { fileName, mimeType, base64 } }` to `APPS_SCRIPT_URL`. Map the backend's `validation`, `applications_closed`, `role_closed` and `server` errors to the strings master messages. Never log the file or the secret.
- Keep requests under the hosting limit: reject files over 4 MB before reading them fully. On Vercel the whole request must stay under 4.5 MB.
- While sending, the button reads "Sending" and is disabled. On success, replace the form with the thank-you panel (check icon, "Thank you for applying.", paragraph, "Pass it on."). There is no "apply again" button.

## Phase 5: Tests and checks

- Unit: the application schema (every rule above, including the designer's required link and each confirmation), the magic-byte check, the role lookup (unknown id and the Core and Content Lead id `core-and-content-lead-and-network-chaplain` are both rejected), the Home signup schema without full name and with phone required.
- Component: role card disclosure (keyboard and `aria-expanded`), filter updates `?team=`, "Apply for this role" preselects the role and swaps the questions, `FileInput` shows the file name and stays reachable by keyboard, `Select` shows the custom indicator and works with the keyboard.
- Route: `/api/apply` with a valid PDF, a renamed text file, a 5 MB file, a missing confirmation, and a backend `validation` response; mock `fetch` to Apps Script.
- Pages test: `/volunteer` and `/volunteer/roles` render; `/build-with-us` redirects; no page contains "places still open" or "20 places".
- `npm run lint`, `npm run test` and `npm run build` pass. Check both new pages at 320, 390, 768, 1280, 1440 and 1920px, with the keyboard only, and with a screen reader on the form.
- After deploying, send one real application with a small PDF and confirm the row in **Volunteer Applications**, the CV in the Drive folder and the email to `notify_email`. Then delete them.

Report what you changed, anything in the design reference you could not match exactly, and any string you had to add that is not in the strings master.
