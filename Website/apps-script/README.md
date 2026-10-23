# Strangers for Mary sign-up backend (Google Apps Script)

`Code.gs` is the whole backend: one file you paste into the Apps Script editor. It stores every sign-up in a Google Sheet and tells the website how many core team places are left.

## 1. Create the Sheet

1. Signed in with the Google account that should own the data (for example admin@strangersformary.org), create a new Google Sheet. Name it `Strangers for Mary Sign-ups`.
2. Open **Extensions > Apps Script**. Name the project `SFM Sign-ups`.

## 2. Paste the code

1. In the editor, open `Code.gs`, delete what is there, and paste the whole of `Code.gs` from this folder.
2. Click the gear icon (**Project Settings**) and tick **Show "appsscript.json" manifest file in editor**. Back in the editor, open `appsscript.json` and replace its contents with `appsscript.json` from this folder.
3. Save (Ctrl or Cmd + S).

## 3. Set the shared secret

1. Make a long random secret. On a Mac, run `openssl rand -hex 32` in Terminal and copy the result.
2. **Project Settings > Script properties > Add script property**. Property: `SFM_SHARED_SECRET`. Value: the secret. Save.
3. Keep the secret somewhere safe. The website needs the same value.

## 4. Run setup

1. In the editor, choose the function `setup` in the toolbar and click **Run**.
2. Google asks for permission the first time. Choose your account, then **Advanced > Go to SFM Sign-ups (unsafe) > Allow**. This is normal for your own scripts.
3. The Sheet now has four tabs: **Strangers**, **Core Team Applications**, **Config** and **Log**.
4. Check **Config**: `core_team_total` is 20, `core_team_filled_override` is 3 (so 17 places show as open), `notify_email` is admin@strangersformary.org, `accepting_applications` is TRUE. Change these at any time; the website picks up changes within a minute.

To count real acceptances instead of the override, clear the value next to `core_team_filled_override`. The script then counts rows marked `Accepted` in Core Team Applications.

## 5. Test it (optional, recommended)

Choose `runAllTests` and click **Run**, then open **Execution log**. Every line should start with PASS. The tests add a few rows with emails ending in `@example.test` and may send one test email; delete those rows afterwards.

## 6. Deploy as a web app

1. **Deploy > New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Description: `v1`. Execute as: **Me**. Who has access: **Anyone**.
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

## 7. Connect the website

In `Website/web/.env.local` (never commit this file):

```bash
APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXX/exec
APPS_SCRIPT_SECRET=the-same-secret-as-step-3
```

Add the same two values to the hosting provider's environment variables when the site goes live. The website calls the script from its server only, never from the browser.

## 8. Check the live web app

Apps Script answers with a redirect, so use `-L`:

```bash
URL="https://script.google.com/macros/s/XXXXXXXX/exec"
SECRET="your-secret"

# Health
curl -sL "$URL?action=health&secret=$SECRET"

# Places left
curl -sL "$URL?action=places&secret=$SECRET"

# A sign-up
curl -sL -X POST "$URL" -H "Content-Type: application/json" -d '{
  "secret": "'"$SECRET"'", "action": "signup", "sourcePage": "home",
  "fullName": "Test Person", "baptismName": "Mary", "email": "test@example.test",
  "parish": "St Anthony", "city": "Buea, Cameroon", "whatsapp": "",
  "joinAsStranger": true, "applyCoreTeam": false, "teams": [], "about": ""
}'
```

## Changing the code later

After editing `Code.gs`, **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. The URL stays the same. Saving alone does not update the live web app.

## Changing the secret

Update `SFM_SHARED_SECRET` in Script properties and `APPS_SCRIPT_SECRET` on the website at the same time. No redeploy is needed.

## What the website receives

| Request | Response |
| --- | --- |
| POST signup, success | `{ "ok": true, "strangerId": "STR-…", "applicationId": "APP-…" or null, "updated": false, "placesLeft": 17 }` |
| Wrong secret | `{ "ok": false, "error": "unauthorised" }` |
| Invalid fields | `{ "ok": false, "error": "validation", "fields": { "email": "invalid" } }` (codes: `required`, `invalid`, `too_long`; `choice` when neither box is ticked) |
| Core team full or closed | `{ "ok": false, "error": "core_team_full", "strangerId": "STR-…", "placesLeft": 0 }`. The person is still saved as a stranger |
| Anything unexpected | `{ "ok": false, "error": "server" }`, with details in the Log tab |
| GET places | `{ "ok": true, "total": 20, "filled": 3, "left": 17, "accepting": true }` |
| GET health | `{ "ok": true, "time": "…" }` |

## How it behaves

- One row per email in **Strangers**. Signing up again updates the details instead of adding a duplicate, and never removes someone from the stranger list.
- Core team applications go to **Core Team Applications** with status `New`, and an email goes to `notify_email` with a link to the row. A second application from the same email, while still `New`, updates that row.
- Use the status dropdowns to track people: Waitlist, Invited, Active, Left for strangers; New, Interview invited, Accepted, Declined for applications. The `notes` column is yours; the script never writes to it after creating a row.
- Every rejected request and error is written to **Log**. The secret is never logged.
- Text that starts with `=`, `+`, `-` or `@` is stored with a leading apostrophe so it can never run as a formula.
