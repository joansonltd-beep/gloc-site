# Lead capture via Google Sheet

The site sends each lead to `/api/lead` (server-side), which forwards it to the
URL in `LEAD_WEBHOOK_URL`. Here we make that URL a Google Apps Script web app
that appends a row to a Google Sheet.

Because the forward happens server-to-server (not from the browser), there are
no CORS issues and "Anyone" access is fine.

## 1. Create the sheet

1. Go to https://sheets.google.com and create a new blank spreadsheet.
2. Name it something like "GLOC site leads".
3. In row 1, add these headers (the script also creates them automatically if
   the sheet is empty, but setting them is tidy):

   `submittedAt` · `source` · `page` · `recommended` · `message` · `figures`

## 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete any starter code and paste in the contents of
   `google-apps-script.gs` (in this same folder).
3. Click **Save** (disk icon).

## 3. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** anything (e.g. "lead webhook")
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Authorize when prompted (choose your account →
   Advanced → "Go to <project> (unsafe)" → Allow). This is normal for your own
   script.
5. Copy the **Web app URL**. It ends in `/exec`.

## 4. Wire it into the site

1. In the project folder, open `.env.local` (copy it from `.env.local.example`
   if you haven't yet).
2. Set:

   ```
   LEAD_WEBHOOK_URL=https://script.google.com/macros/s/XXXXX/exec
   ```

3. Restart the dev server (`npm run dev`).

## 5. Test

Submit any tool on the site (or run the curl below). A new row should appear in
the sheet within a second or two.

```
curl -X POST http://localhost:3000/api/lead -H "Content-Type: application/json" \
  -d '{"source":"test","message":"hello","recommended":"Life","figures":{"a":1},"page":"/protect","submittedAt":"2026-06-14T12:00:00Z"}'
```

## Re-deploying after editing the script

If you change the script later, do **Deploy → Manage deployments → edit (pencil)
→ Version: New version → Deploy**. The `/exec` URL stays the same.
