# Reusable build prompt — small-business website (any country, any sector)

How to use this:
1. Create an empty folder and point Claude Code at it.
2. Fill in the **CLIENT BRIEF** below (country, currency and business type drive everything).
3. Paste this whole file as your first message.
4. Build one milestone at a time. Commit after each. Have accounts ready:
   GitHub, Vercel, Sanity, a domain, a WhatsApp/phone number, and (if selling
   online) a payment account.

This template is **not tied to any country or industry.** Do not assume a
location, currency, or sector. Use what the brief says.

---

## CLIENT BRIEF (fill this in)

- **Business name:** …
- **Type of business / industry:** … (e.g. salon, plumber, bakery, insurance agent, gym)
- **What they do (one plain sentence):** …
- **Country:** … (e.g. Grenada)
- **Currency:** … (code + symbol, e.g. XCD / EC$, TTD / TT$, USD / $)
- **Area served:** … (town/region/country)
- **Target customers:** …
- **Services or offerings** (3–6, each with a one-line description): …
- **Sell products online?** yes / no. If yes, list product types and the
  preferred checkout (see the E-commerce section).
- **Brand colours:** … (hex codes, or "pick a tasteful professional palette")
- **Logo:** uploaded in the CMS (white background fine)
- **Contact:** WhatsApp/phone number (digits only, full international form) ·
  email · address if relevant
- **Socials:** Facebook / Instagram / LinkedIn / TikTok / YouTube / X URLs
- **Domain:** …
- **Regulated industry?** If yes, list the ONLY titles/words allowed and the
  words to avoid. If no, ignore.

---

## ROLE & GOALS

Build a fast, mobile-first marketing website for the business above. Goals:
build trust, look professional, and turn visitors into contacts (WhatsApp/phone
messages and callback or enquiry requests), and into orders if they sell online.
Keep everything editable by a non-technical owner.

## LOCALISATION (important)

- Use the brief's **country, currency and area served** everywhere. Format money
  in the client's currency and locale. Use local spelling and local examples.
- Phone/WhatsApp numbers in full international form.
- Do not hardcode any country, currency, or sector. They are all inputs.

## TECH STACK (non-negotiable)

- **Next.js** (App Router, TypeScript) + **Tailwind CSS**.
- **Sanity** CMS with an **embedded Studio at `/studio`**. ALL content in Sanity,
  nothing hardcoded. Use a `(site)` route group so the Studio renders without the
  site header/footer; keep a minimal root layout.
- **Vercel** for hosting.
- **Lead capture:** a `/api/lead` route that forwards to a webhook in
  `LEAD_WEBHOOK_URL` (e.g. a Google Apps Script writing to a Google Sheet).
  Provide the script. Never block the visitor if the webhook is unset.
- **WhatsApp deep links** for contact: `https://wa.me/<NUMBER>?text=<message>`.
- Read the bundled Next.js docs in `node_modules/next/dist/docs` before coding.
- Drive all colours from CSS variables in one file so the palette is retunable.
- Defensive env handling: a blank or invalid env var must never crash the build.
  Build the read client lazily.

## SITE STRUCTURE

- **Home:** hero (who you help + what you do, with a primary CTA and a WhatsApp
  CTA) → a short "what are you here for" router of the offerings → offering cards
  → Why work with us → How it works → credibility band → testimonials → about
  teaser. (If they sell products, add a "Featured products / Shop" section.)
- **One detail page per offering**: what it is, why it matters, an optional tool
  where it genuinely helps (calculator, estimate/quote form, booking), ending in
  a clear CTA.
- **About:** story behind a "Learn more" toggle, a separate About photo, optional
  intro video (file upload preferred over embed URL).
- **Book / Contact:** an enquiry/callback form that writes to the lead store,
  plus WhatsApp.
- Global: WhatsApp float button (desktop) + sticky mobile CTA bar on phones.

## CONTENT MODEL (Sanity, all editable)

- **Site settings:** business name, tagline, hero copy, logo, photo, footer
  disclaimer, country, currency, WhatsApp/phone, social URLs, contact details.
- **Offerings/services:** title, blurb, icon, detail copy, optional tool.
- **Testimonials:** quote, person, related offering (placeholders, clearly marked
  to replace with real consented quotes).
- **About content:** story (rich text), photo, video, credentials.
- **Products** (only if selling online): name, image, price (in the client's
  currency), description, optional checkout link/id.
- Provide a **seed script** using `createIfNotExists` so re-running never
  overwrites the owner's edits.

## E-COMMERCE (optional module, build only if the brief says "sell online: yes")

Pick the approach that matches the client's country and volume:

- **WhatsApp-order catalogue (default, no gateway, ~zero running cost):**
  products in the CMS with an "Order on WhatsApp" button that pre-fills the item
  and price; payment arranged in chat (transfer, cash on delivery, payment link).
  Best for low volume and regions where card gateways are hard to set up.
- **Hosted checkout via a regional provider:** for the Caribbean, **Fygaro**
  (payment buttons / hosted checkout / invoices) is a good fit; store the Fygaro
  button or product link per product in the CMS and render a "Buy now" button.
  Elsewhere, **Stripe** where the country is supported. Always confirm the
  provider supports payouts in the client's country before promising checkout.
- Keep prices and totals in the client's currency. Do not build custom card
  handling; always use the provider's hosted checkout (they handle PCI).

## LEAD CAPTURE (enquiry/callback form)

Fields: name, phone, best time to contact, and a **multi-select of the offerings**
("What would you like help with? Pick any that apply"), plus optional sector
fields. POST to `/api/lead` with `name`, `phone`, `message`, `recommended`, and a
`figures` object. The lead store (e.g. Google Sheet) has clear columns. Show a
friendly confirmation. Leads are internal only.

## COPY RULES (strict)

Natural, professional, human tone. Plain English, short sentences, specific
benefits, local relevance. Do NOT use: em dashes; AI marketing language;
corporate buzzwords; empty claims; or clichés ("unlock your potential", "take
control", "empower", "transform", "elevate", "journey", "tailored solutions",
"comprehensive approach"). Avoid guarantees, promises, and implied outcomes. If
the industry is regulated, use only the approved titles from the brief.

## CONVERSION, SEO, ACCESSIBILITY, PERFORMANCE

- Every page has one clear next step (contact, book, or buy).
- SEO: per-page title + description, `metadataBase` + canonical on the real
  domain, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, **LocalBusiness
  JSON-LD** (name, area served, offerings, phone), and a Google Search Console
  verification slot. Recommend a Google Business Profile.
- Accessibility: skip link, visible focus rings, alt text, `aria-current` nav,
  decorative elements hidden from screen readers, respect `prefers-reduced-motion`.
- Mobile-first and tap-friendly. Use `next/image`; allow `cdn.sanity.io`. Remove
  unused default assets.

## WORKING STYLE

- Build in milestones, ONE at a time, stop for review after each:
  M0 scaffold → M1 home + router → M2 offering pages (+ optional tools) →
  M3 contact + lead capture → M4 Sanity + move all content in →
  M5 about/contact + polish + mobile QA → M6 deploy to Vercel + domain + SEO →
  M7 (optional) e-commerce.
- Commit after each milestone. Before any big visual change, create a git tag as
  an "undo" checkpoint.
- Verify with the dev server, type-check, and lint before claiming done. Report
  honestly. Keep a `todo.md`.

Start with M0 only and confirm the local URL before moving on.
