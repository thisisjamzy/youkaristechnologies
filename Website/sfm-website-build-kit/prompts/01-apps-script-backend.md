# Prompt 1: Google Apps Script backend for the Strangers for Mary sign-ups

Paste everything below the line into Claude Code or Cursor, opened at the repository root `youkaristechnologies/`. The script lives in `Website/apps-script/`, beside the Next.js app in `Website/web/`. Build this first: the website talks to it.

---

You are building the backend for the Strangers for Mary pre-launch website: a Google Apps Script web app bound to one Google Sheet. It receives sign-ups from the Next.js site, stores them, and reports how many core team places are left. Write clean, commented, modular Apps Script (V8 runtime, modern JavaScript). Keep the code in this repository under `Website/apps-script/` so it is version controlled, and set it up with `clasp` (`.clasp.json`, `appsscript.json`, `src/*.js` inside that folder).

## What the system does

1. People fill one form on the website. Every sign-up is a **stranger** who wants to join the network when the app (Youkaris) opens. Some also **apply for the core team** (20 places in total, one for every mystery of the Rosary).
2. The Next.js server (never the browser) sends each submission to this web app with a shared secret.
3. The web app validates it, writes it to the Sheet, and returns JSON.
4. The website asks this web app how many core team places are left, and shows that number.

## The Spreadsheet

Create these sheets with a `setup()` function that is safe to run more than once: it creates missing sheets and header rows, freezes the header row, sets column widths, and adds data validation where noted. It never deletes data.

### Sheet `Strangers` (one row per email address)

| Column | Notes |
| --- | --- |
| id | `STR-` + short unique id |
| created_at | ISO timestamp |
| updated_at | ISO timestamp, set on every update |
| full_name | Kept private, never shown to other strangers |
| baptism_name | The name the person is known by in the network |
| email | Stored lowercased and trimmed; the unique key |
| parish | |
| city | City and country |
| whatsapp | Optional |
| join_as_stranger | TRUE or FALSE |
| source_page | `home` or `build-with-us` |
| status | Dropdown: `Waitlist`, `Invited`, `Active`, `Left`. New rows start as `Waitlist` |

### Sheet `Core Team Applications`

| Column | Notes |
| --- | --- |
| id | `APP-` + short unique id |
| created_at | ISO timestamp |
| updated_at | ISO timestamp |
| full_name | |
| baptism_name | |
| email | Lowercased |
| parish | |
| city | |
| whatsapp | |
| teams | Comma-separated, any of: Stranger Relations, Outreach, Core and Content, Technology |
| about | Free text from "Tell us about yourself" |
| status | Dropdown: `New`, `Interview invited`, `Accepted`, `Declined`. New rows start as `New` |
| notes | For the team, never written by the script after creation |

### Sheet `Config` (key, value)

| key | value | Meaning |
| --- | --- | --- |
| core_team_total | 20 | Total places |
| core_team_filled_override | 3 | If not blank, this number is used as the places filled. Today 3 places are filled, so 17 are left |
| notify_email | admin@strangersformary.org | Who is emailed when a core team application arrives. Blank turns emails off |
| accepting_applications | TRUE | FALSE closes applications |

Places left = `core_team_total` minus (`core_team_filled_override` when it has a value, otherwise the count of `Accepted` rows in Core Team Applications). Never below 0.

### Sheet `Log`

timestamp, level (`info`, `warn`, `error`), action, message, email (if any). Log every error and every rejected request. Never log the secret.

## The API

Deploy as a web app: execute as the owner, access "Anyone". The Next.js server is the only caller. It must send the shared secret, which is stored in **Script Properties** as `SFM_SHARED_SECRET` (never in code). Every response is JSON from `ContentService` with MIME type JSON.

### `POST` (body is JSON)

```json
{
  "secret": "…",
  "action": "signup",
  "sourcePage": "home",
  "fullName": "…",
  "baptismName": "…",
  "email": "…",
  "parish": "…",
  "city": "…",
  "whatsapp": "…",
  "joinAsStranger": true,
  "applyCoreTeam": false,
  "teams": [],
  "about": "",
  "submittedAt": "2026-10-23T12:00:00.000Z"
}
```

Rules:

1. Reject a wrong or missing secret with `{ "ok": false, "error": "unauthorised" }`.
2. Validate on the server even though the site validates too: required fullName, baptismName, email, parish, city; email format; maximum lengths (names 120, parish and city 160, whatsapp 40, about 2000); `teams` only from the four allowed values; `sourcePage` only `home` or `build-with-us`. Reject with `{ "ok": false, "error": "validation", "fields": { "email": "invalid" } }`.
3. Neutralise spreadsheet formula injection: any value that starts with `=`, `+`, `-` or `@` is stored with a leading apostrophe.
4. Wrap all writes in `LockService.getScriptLock()` (wait up to 10 seconds).
5. Strangers: upsert by email. A new email appends a row; an existing email updates the details and `updated_at`, and never downgrades `join_as_stranger` from TRUE to FALSE.
6. If `applyCoreTeam` is true: if applications are closed or no places are left, return `{ "ok": false, "error": "core_team_full" }` but still save the stranger. Otherwise, if the email has an application with status `New`, update it; if not, append a new application. Then email `notify_email` (if set) a short plain-text summary with a link to the row.
7. Success: `{ "ok": true, "strangerId": "STR-…", "applicationId": "APP-…" or null, "updated": true or false, "placesLeft": 17 }`.
8. Any unexpected error: log it and return `{ "ok": false, "error": "server" }`. Never return stack traces.

### `GET ?action=places&secret=…`

Returns `{ "ok": true, "total": 20, "filled": 3, "left": 17, "accepting": true }`. Cache the result with `CacheService` for 60 seconds, and clear that cache whenever an application is written or the Config sheet is edited (`onEdit` trigger on Config).

### `GET ?action=health&secret=…`

Returns `{ "ok": true, "time": "…" }` for monitoring.

## Code organisation

```text
Website/apps-script/
├── appsscript.json        V8, timezone Africa/Douala, web app settings
├── .clasp.json            script id (placeholder until created)
├── README.md              setup, deploy, rotate secret, test with curl
└── src/
    ├── main.js            doGet, doPost: routing only
    ├── config.js          sheet names, column maps, allowed values, limits
    ├── setup.js           setup(), idempotent
    ├── auth.js            secret check
    ├── validate.js        validation and sanitising
    ├── repository.js      read/write helpers: findRowByEmail, appendRow, updateRow (by header name, never by hard-coded column letters)
    ├── strangers.js       upsertStranger
    ├── applications.js    upsertApplication, countAccepted
    ├── places.js          getPlaces with cache
    ├── notify.js          application email
    ├── log.js             log helper
    ├── respond.js         json() helper
    └── tests.js           runAllTests(): manual test functions that call the handlers with sample payloads against a test copy of the sheet
```

Column access must go through a header map built from row 1, so adding or reordering columns in the Sheet never breaks the script.

## Deliver

1. The code above, ready for `clasp push`.
2. `Website/apps-script/README.md` with: create the Sheet, open Extensions > Apps Script, link with clasp, run `setup()`, set `SFM_SHARED_SECRET` in Project Settings > Script properties, deploy as web app, copy the web app URL into `Website/web/.env.local` as `APPS_SCRIPT_URL` and the secret as `APPS_SCRIPT_SECRET`, redeploy after changes (new version), and sample `curl` commands for signup, places and health. Note that Apps Script web apps answer with a redirect to `script.googleusercontent.com`, so callers must follow redirects.
3. A short list of anything you could not decide and need the team to confirm.
