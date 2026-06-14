# Sanity CMS setup & editing walkthrough (M4)

All editable content (WhatsApp number, hero copy, clusters, lines, testimonials,
cost figures, footer disclaimer, about teaser) lives in Sanity. The site reads
from Sanity at runtime and falls back to bundled defaults until you connect a
project, so it always runs.

The Studio is embedded in this app at **`/studio`** (e.g. http://localhost:3000/studio).

---

## One-time setup

### 1. Create a Sanity project
1. Go to https://www.sanity.io and sign up / log in (Google, GitHub or email).
2. In https://www.sanity.io/manage, click **Create new project**.
3. Name it (e.g. "Guardian Agent Site"). It creates a **Project ID** and a
   dataset called **production**. Note the Project ID.

### 2. Allow the site to talk to Sanity (CORS)
In your project at sanity.io/manage → **API → CORS origins → Add origin**:
- `http://localhost:3000` — tick **Allow credentials**. (Add your real domain
  the same way after M6.)

### 3. Create a write token (for the one-time content import)
sanity.io/manage → **API → Tokens → Add API token**:
- Name: "seed", Permissions: **Editor**. Copy the token now (shown once).

### 4. Put the values in `.env.local`
Copy `.env.local.example` to `.env.local` if you haven't, then set:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your_editor_token
```

### 5. Import the existing content
```
npm run seed
```
This pushes the current site content into Sanity (site settings, clusters,
lines, testimonials, cost figures, about). Run it once. You can delete the
write token afterwards if you like (it's only used for seeding).

### 6. Restart and open the Studio
```
npm run dev
```
Open http://localhost:3000/studio and log in with the same Sanity account.
You'll see: Site settings, About content, Clusters, Lines, Testimonials,
Cost figures.

---

## Editing an item end-to-end (try this)

1. Open **`/studio`** and click **Testimonials**.
2. Open the first testimonial. Change the **Quote** text.
3. Click **Publish** (bottom-right).
4. Go to the site home page and refresh. The testimonial band shows your new
   text. (In production, edits appear within ~60 seconds; in local dev they
   show on refresh.)

Same flow for a **Cost figure**: open **Cost figures → Major orthopedic surgery
(high)**, change the **Value**, Publish, then reload `/protect` and run the
Protection Planner — the numbers reflect your new figure.

To change the **WhatsApp number**, edit **Site settings → WhatsApp number** and
Publish. Every WhatsApp link across the site uses it.

---

## Notes
- **Keys are stable ids.** On Clusters and Cost figures, the `key` field is what
  the code looks up (e.g. `orthopedicSurgeryHigh`, `protect`). Edit labels,
  values and copy freely, but don't change `key` values once live.
- **Deploying the Studio (later).** The Studio also deploys with the site to
  Vercel at `yourdomain.com/studio` in M6. You can optionally host it separately
  with `npx sanity deploy`.
