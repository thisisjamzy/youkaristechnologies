# Strangers for Mary backend (Google Apps Script), version 2

`Code.gs` is the whole backend: one file you paste into the Apps Script editor. It stores Home page sign-ups and volunteer applications in a Google Sheet, saves each applicant's CV to a private Google Drive folder, and emails the team when an application arrives.

## What changed from version 1

- **Volunteer applications per role.** A new `apply` action and a new **Volunteer Applications** tab: one row per application, with the role, the three answers (and the questions they answer), links, weekly time, the three confirmations and a link to the CV in Drive.
- **CVs are saved to Drive.** `setup()` creates a private folder called "Strangers for Mary · Volunteer CVs" and stores its id in **Config**. Only the account that owns the script can open the files. PDF, DOC and DOCX only, up to `max_cv_mb` (4 MB by default). The script checks the file really is that type, not just its name.
- **Home sign-up matches the new form.** Phone number is required, email is optional, full name is no longer asked. People are matched by phone number first, then email, so signing up twice updates one row.
- **No more places counter.** The website no longer shows how many places are left. `GET ?action=places` and the old `applyCoreTeam` fields still work so nothing breaks while the new site is deployed, and the old **Core Team Applications** tab is kept with its rows.
- **New permission.** The script now needs Google Drive access to save CVs. You approve this once when you run `setup()`.

## Upgrade an existing deployment

1. Open the Sheet, then **Extensions > Apps Script**.
2. Replace everything in `Code.gs` with the new `Code.gs`.
3. Replace `appsscript.json` with the new one (it adds the Drive permission). If you cannot see it: **Project Settings > Show "appsscript.json" manifest file in editor**.
4. Save, choose `setup` and click **Run**. Approve the new permission when Google asks (**Advanced > Go to SFM Sign-ups (unsafe) > Allow**).
5. Check the Sheet: a new **Volunteer Applications** tab, and new **Config** rows `closed_roles`, `cv_folder_id` (now filled in) and `max_cv_mb`.
6. Optional but recommended: run `runAllTests` and open **Execution log**. Every line should start with PASS. Then delete the test rows (emails ending `@example.test`, phone numbers starting `+237 600 000`) and the test CVs in the Drive folder.
7. **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. The web app URL stays the same, so the website needs no new settings. Saving alone does not update the live web app.

## New setup from scratch

1. Signed in with the account that should own the data (for example admin@strangersformary.org), create a Google Sheet called `Strangers for Mary Sign-ups`, then **Extensions > Apps Script**. Name the project `SFM Sign-ups`.
2. Paste `Code.gs` and `appsscript.json` as above.
3. **Project Settings > Script properties > Add script property**: `SFM_SHARED_SECRET` = a long random value (on a Mac: `openssl rand -hex 32`). The website needs the same value.
4. Run `setup` and approve the permissions.
5. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has access: **Anyone**. Copy the URL ending in `/exec`.
6. In `Website/web/.env.local` (never committed) and in the hosting provider's settings:

```bash
APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXX/exec
APPS_SCRIPT_SECRET=the-same-secret
```

The website calls the script from its server only, never from the browser.

## The Config tab

| Key | Meaning |
| --- | --- |
| `notify_email` | Who is emailed when an application arrives. Blank turns emails off. |
| `accepting_applications` | FALSE closes applications on every role. |
| `closed_roles` | Role ids not taking applications, separated by commas. Usually blank: applications for a filled role are kept "On file" for when it opens again. |
| `cv_folder_id` | The Drive folder for CVs. Filled in by `setup()`. |
| `max_cv_mb` | Largest CV accepted, in MB. Keep 4 or less on Vercel, which refuses requests over 4.5 MB. |
| `core_team_total`, `core_team_filled_override` | Version 1 only. Ignore. |

Role ids are listed in `ROLES` at the top of `Code.gs` and match `content/roles.json` in the build kit. The Core and Content Lead is appointed by the Network Custodian and is not in the list, so it can never be applied for.

## What the website sends and receives

| Request | Response |
| --- | --- |
| POST `signup` (Home): `baptismName`, `phone`, `parish`, `city`, `email` (optional), `joinAsStranger: true`, `sourcePage: "home"` | `{ "ok": true, "strangerId": "STR-…", "updated": false }` |
| POST `apply` (Roles): `roleId`, `fullName`, `baptismName`, `phone`, `email`, `parish`, `city`, `hours`, `questions` (the three question texts), `answers: { q1, q2, q3 }`, `links`, `confirmUnpaid`, `confirmSunday`, `confirmRosary`, `joinAsStranger`, `cv: { fileName, mimeType, base64 }`, `sourcePage: "roles"` | `{ "ok": true, "applicationId": "VOL-…", "updated": false }` |
| Invalid fields | `{ "ok": false, "error": "validation", "fields": { "phone": "invalid" } }`. Codes: `required`, `invalid`, `too_long`; for the CV also `invalid_type` and `too_large` |
| Applications closed, or that role closed | `{ "ok": false, "error": "applications_closed" }` or `{ "ok": false, "error": "role_closed" }` |
| Wrong secret | `{ "ok": false, "error": "unauthorised" }` |
| Anything unexpected | `{ "ok": false, "error": "server" }`, details in the **Log** tab |
| GET `health` | `{ "ok": true, "time": "…" }` |
| GET `roles` | `{ "ok": true, "accepting": true, "roles": [{ "id", "title", "team", "open" }] }` |

`hours` must be one of: `Up to 3 hours`, `4 to 6 hours`, `7 hours or more`.

## Check the live web app

Apps Script answers with a redirect, so use `-L`:

```bash
URL="https://script.google.com/macros/s/XXXXXXXX/exec"
SECRET="your-secret"
curl -sL "$URL?action=health&secret=$SECRET"
curl -sL "$URL?action=roles&secret=$SECRET"
```

## How it behaves

- **Strangers:** one row per person, matched on phone number, then email. Signing up again updates the details and never removes anyone from the list.
- **Volunteer Applications:** a new application arrives with status `New`. A second application from the same email for the same role, while still `New`, updates that row and saves the new CV beside the old one. Applying for a different role creates a separate row.
- **Statuses:** New, Reviewing, Interview invited, Accepted, On file, Declined. Use "On file" for good applicants whose role is filled. The `notes` column is yours; the script never writes to it after creating a row.
- **Applicants who tick "Also invite me to join the network as a stranger"** are also added to (or updated in) **Strangers**.
- **Privacy:** CVs stay in the private folder and are never shared. Delete CVs of people who are declined or withdraw. Every rejected request and error is written to **Log**; the secret is never logged.
- Text starting with `=`, `+`, `-` or `@` is stored with a leading apostrophe so it can never run as a formula. That is why phone numbers starting with `+` show an apostrophe in the cell.
