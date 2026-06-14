# Deploy to Vercel + connect domain (M6)

## Step 1 — Create the GitHub repo (you click, I push)

1. Go to https://github.com/new (log in if needed).
2. **Repository name:** e.g. `gloc-site`.
3. **Private** is fine (Vercel works with private repos).
4. **Do NOT** tick "Add a README", ".gitignore", or "license" — leave the repo
   completely empty.
5. Click **Create repository**.
6. Copy the repo URL shown (e.g. `https://github.com/yourname/gloc-site.git`)
   and send it to me. I'll add it as the remote and push.

## Step 2 — Import the project into Vercel

1. Go to https://vercel.com and sign in **with GitHub**.
2. Click **Add New… → Project**.
3. Find your `gloc-site` repo and click **Import**. (If you don't see it:
   **Adjust GitHub App Permissions** → grant access to the repo.)
4. Framework Preset should auto-detect **Next.js**. Leave build settings default.
5. **Before clicking Deploy**, expand **Environment Variables** and add these
   (Name → Value), for all environments:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `83r56hq8` |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `18687236644` |
   | `LEAD_WEBHOOK_URL` | your Google Sheet `/exec` webhook URL |
   | `NEXT_PUBLIC_SITE_URL` | leave for now, or `https://<project>.vercel.app` |

   Do **not** add `SANITY_API_WRITE_TOKEN` — it's only for local seeding.
6. Click **Deploy** and wait for the build to finish (a couple of minutes).
7. You'll get a live URL like `https://gloc-site-xxxx.vercel.app`. Open it and
   click around.

## Step 3 — Let Sanity talk to the live site (CORS)

So the Studio works at your live `/studio`:

1. Go to https://www.sanity.io/manage → your project → **API → CORS origins**.
2. **Add origin:** your Vercel URL (e.g. `https://gloc-site-xxxx.vercel.app`),
   tick **Allow credentials**, Save.
3. Add your custom domain the same way once it's connected (Step 4).

## Step 4 — Connect your custom domain

1. In Vercel: your project → **Settings → Domains**.
2. Type your domain (e.g. `youragency.com`) and click **Add**.
3. Vercel shows DNS records to set. Two common cases:
   - **Apex domain** (`youragency.com`): add an **A record** → `76.76.21.21`
     (Vercel shows the exact value).
   - **www subdomain** (`www.youragency.com`): add a **CNAME** →
     `cname.vercel-dns.com`.
   - Or, if you prefer, change your registrar's **nameservers** to Vercel's
     (Vercel will list them). Either approach works.
4. Set these records at your domain registrar (GoDaddy, Namecheap, etc.).
5. Back in Vercel, it will verify automatically (can take minutes to a few
   hours for DNS to propagate). Once verified, **HTTPS is issued automatically**
   — you'll see the padlock and a valid certificate. No manual SSL steps.
6. Set `NEXT_PUBLIC_SITE_URL` (Vercel → Settings → Environment Variables) to
   `https://youragency.com` and **redeploy** so canonical URLs, sitemap and
   robots point at the real domain.
7. Add the custom domain to Sanity CORS (Step 3).

## Updating the site later

- **Content** (copy, testimonials, cost figures, WhatsApp number): edit in
  Studio at `yourdomain.com/studio` → Publish. No redeploy needed.
- **Code**: push to the `main` branch → Vercel auto-builds and deploys.

---

## Pre-launch checklist (from spec.md)

**Launch blockers**
- [ ] **GLOC logo sign-off in writing** before displaying the Guardian/GLOC mark
      (spec.md §12). Until then the site shows an "Authorized Guardian
      Representative" text placeholder only — do not add the logo without sign-off.
- [ ] **Verify cost figures against a real private-facility quote** (spec.md §10):
      orthopedic surgery + post-op, dialysis monthly, health-plan ranges. Update
      them in Studio → Cost figures. They are flagged placeholders today.

**Content to finalise (in Studio)**
- [ ] Agent name, tagline, hero copy (Site settings) — currently "Agent Name".
- [ ] Real headshot / HeyGen intro video URL (About content).
- [ ] About story + credentials (About content).
- [ ] Real testimonials with consent to publish (Testimonials).
- [ ] Footer disclaimer / compliance wording (Site settings).

**Config**
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` is the correct WhatsApp Business number;
      test a CTA on a real phone (opens WhatsApp with the pre-filled message).
- [ ] `LEAD_WEBHOOK_URL` set; submit a test and confirm a row lands in the Sheet.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain; check `/sitemap.xml` and
      `/robots.txt` show the real domain.
- [ ] Vercel + custom domain added to Sanity CORS origins.

**Quality**
- [ ] Click every tool on a phone; confirm results and WhatsApp links.
- [ ] Check legibility/contrast and keyboard navigation.
- [ ] Confirm `/studio` loads and you can log in on the live domain.
