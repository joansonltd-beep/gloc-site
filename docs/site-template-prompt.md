# Reusable build prompt — small-business website

How to use this:
1. Create an empty folder and point Claude Code at it.
2. Fill in the **CLIENT BRIEF** below.
3. Paste this whole file as your first message.
4. Build one milestone at a time. Commit after each. Have accounts ready:
   GitHub, Vercel, Sanity, a domain, and a WhatsApp number.

---

## CLIENT BRIEF (fill this in)

- **Business name:** …
- **What they do (one sentence, plain):** …
- **Location / area served:** … (e.g. Trinidad and Tobago)
- **Target customers:** …
- **Services / offerings** (the main 3–6 areas, each with a one-line description): …
- **Brand colours:** … (give hex codes, or say "pick a tasteful, professional palette and avoid navy/gold")
- **Logo:** will be uploaded in the CMS (white background is fine)
- **Contact:** WhatsApp number (digits only, full international form) … · phone … · email …
- **Socials:** Facebook / Instagram / LinkedIn / TikTok / YouTube / X URLs (any they have)
- **Domain:** …
- **Regulated industry?** If yes, list the ONLY titles/words allowed and the words to avoid.

---

## ROLE & GOALS

You are building a fast, mobile-first marketing website for the business above.
Primary goals: build trust, look professional, and turn visitors into contacts
(WhatsApp messages and callback requests). Keep everything editable by a
non-technical owner.

## TECH STACK (non-negotiable)

- **Next.js** (App Router, TypeScript) + **Tailwind CSS**.
- **Sanity** headless CMS with an **embedded Studio at `/studio`**. ALL content
  lives in Sanity, nothing hardcoded. Use a `(site)` route group for the public
  pages and a minimal root layout so the Studio renders without site chrome.
- **Vercel** for hosting.
- **Lead capture:** a `/api/lead` route that forwards submissions to a webhook
  in `LEAD_WEBHOOK_URL` (Google Apps Script writing to a Google Sheet). Provide
  the Apps Script. Never block the user if the webhook is unset.
- **WhatsApp deep links** for contact: `https://wa.me/<NUMBER>?text=<message>`.
- Read the bundled Next.js docs in `node_modules/next/dist/docs` before coding;
  this Next version may differ from training data.
- Drive all colours from CSS variables in one file so the palette is retunable.
- Make env handling defensive (trim/validate; a blank env var must never crash
  the build). Build the read client lazily.

## SITE STRUCTURE

- **Home:** hero (who you help + what you do, with a "Book"/contact CTA and a
  WhatsApp CTA) → a "what are you here for" router of the services → service
  cards → "Why work with us" → "How it works" (book, discuss, recommend, set up,
  ongoing support) → credibility/experience band → testimonials → about teaser.
- **One detail page per service** (`/[area]/[service]`): what it is, why it
  matters, and any relevant interactive tool, ending in a contact CTA.
- **About:** story (collapsed behind a "Learn more" toggle), separate About
  photo field, optional intro video (file upload preferred over embed URL).
- **Book / Contact:** a callback form that writes to the Google Sheet, plus a
  WhatsApp option.
- Global: persistent WhatsApp float button (desktop), sticky mobile CTA bar
  (Book + WhatsApp) on phones.

## CONTENT MODEL (Sanity, all editable)

- **Site settings:** business name, tagline, hero copy, logo, headshot/photo,
  footer disclaimer, WhatsApp number, social URLs, contact details.
- **Services / lines:** title, blurb, icon, detail copy, optional tool.
- **Testimonials:** quote, person, related service (placeholders, clearly noted
  to replace with real consented quotes).
- **About content:** story (rich text), photo, video, credentials.
- Any sector calculators/figures as editable documents.
- Provide a **seed script** using `createIfNotExists` so re-running never
  overwrites the owner's edits.

## LEAD CAPTURE (callback form)

Fields: name, phone, best time to call, and a **multi-select of the services**
("What would you like help with? Pick any that apply"). Optional extra fields as
the sector needs. On submit, POST to `/api/lead` with `name`, `phone`,
`message`, `recommended`, and a `figures` object. The Google Sheet should have
clear columns (submittedAt, source, name, phone, page, recommended, message,
figures). Show a friendly confirmation. Leads are internal only; never shown on
the site.

## COPY RULES (strict)

Write in a natural, professional, human tone. Use plain English, short
sentences, specific benefits, and local relevance. Do NOT use: em dashes; AI
marketing language; corporate buzzwords; empty claims; or clichés like "unlock
your potential", "take control", "empower", "transform", "elevate", "journey",
"tailored solutions", "comprehensive approach". Avoid guarantees, promises, and
statements implying specific outcomes. If the industry is regulated, use only
the approved titles in the brief and avoid any title that implies regulated
advice.

## CONVERSION, SEO, ACCESSIBILITY, PERFORMANCE

- Every page has one clear next step (Book or WhatsApp).
- SEO: per-page title + description, `metadataBase` + canonical on the real
  domain, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, **LocalBusiness
  JSON-LD** (name, area served, services, phone), and a Google Search Console
  verification slot. Recommend a Google Business Profile.
- Accessibility: skip link, visible focus rings, alt text, `aria-current` nav,
  decorative elements `aria-hidden`, respect `prefers-reduced-motion`.
- Mobile-first; tap-friendly; fast. Use `next/image`; allow `cdn.sanity.io`.
  Remove unused default assets.

## WORKING STYLE

- Build in milestones, ONE at a time, and stop for review after each:
  M0 scaffold → M1 home + router → M2 service pages (+ tools) → M3 WhatsApp +
  lead capture → M4 Sanity + move all content in → M5 about/contact + polish +
  mobile QA → M6 deploy to Vercel + domain + SEO.
- Commit after each milestone. Before any big visual change, create a git tag as
  an "undo" checkpoint so the owner can roll back.
- Verify with the dev server, type-check, and lint before saying something is
  done. Report honestly.
- Keep a `todo.md` with the milestones ticked off.

Start with M0 only and confirm the local URL before moving on.
