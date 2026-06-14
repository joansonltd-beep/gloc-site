# Build Plan — Guardian Group Agent Website

Milestones from `spec.md` §13. Build in order, one at a time.

- [x] **M0 — Scaffold:** Next.js (App Router, TS) + Tailwind + Git + route structure + todo.md
- [x] **M1 — Landing page + Needs-Router** with placeholder (dummy) content
- [x] **M2 — Cluster hub pages + the five interactive tools** (dummy data)
- [x] **M3 — WhatsApp lead flow** wired across all CTAs and tools
- [x] **M4 — Sanity CMS integration;** move all content into editable fields
- [ ] **M5 — /about, /results, /book pages** + design polish + mobile QA
- [ ] **M6 — Deploy to Vercel** + connect domain
- [ ] **M7 — (later) AI chat qualifier + booking module**

---

## M0 — done

- Scaffolded Next.js 16 (App Router, TypeScript) with Tailwind CSS v4, ESLint, `src/` dir, `@/*` import alias.
- Initialized Git with a first commit.
- Created placeholder routes: `/`, `/protect`, `/grow`, `/assets`, `/business`, `/about`, `/results`, `/book`.
- Shared nav (clickable between all pages) + footer disclaimer placeholder in the root layout.
- This `todo.md`.

No real content or tools yet — that starts in M1.

## M1 — done

- Agent-led hero with placeholder headshot/video block, name plate, and a small
  "Authorized Guardian Representative" GLOC endorsement slot (pending sign-off).
- Needs-Discovery Router Step 1 — five cards; four link to cluster pages, the
  fifth opens the 4-question discovery flow.
- Discovery flow returns 2–3 recommended lines, each with a one-line "why" and a
  WhatsApp CTA (placeholder logic in `src/lib/content.ts`, placeholder number in
  `src/config/site.ts`).
- Four equal-weight cluster cards, a dummy testimonial band, and an About teaser.
- Footer disclaimer placeholder lives in the root layout.
- Restrained navy + gold palette (Guardian-anchored) in `globals.css`; mobile-first.

All dummy content is centralized in `src/lib/content.ts` for a clean Sanity swap in M4.
WhatsApp links use the placeholder number — full lead flow (float button, capture,
pre-filled context) is wired in M3.

## M2 — done

Four cluster hub pages, each with its line sections + tool(s):
- `/protect` — Life · Health · Critical Illness + **Protection Planner**.
- `/grow` — Pension/Annuities · Investments + **Pension-vs-Inflation** and **Investment Growth** projectors.
- `/assets` — Motor · Home · Property + **Quick-Quote Request**.
- `/business` — Group/employee benefits + **Group Benefits Enquiry**.

- Each tool is its own reusable component under `src/components/tools/`, sharing
  `ToolUI.tsx` (frame, fields, result cards, assumptions) and `WhatsAppCTA.tsx`.
- All cost benchmarks + tool assumptions live in `src/lib/costFigures.ts`
  (spec.md §10 figures, clearly labelled, easy to edit — move to Sanity in M4).
  FV math in `src/lib/finance.ts`, TT$ formatting in `src/lib/format.ts`.
- Every tool shows a clear result and a WhatsApp CTA with a pre-filled summary
  (placeholder number; real wiring + lead capture in M3).
- Line content per cluster added to `src/lib/content.ts` (`LINES`).

## M3 — done

- Every tool result and the discovery router CTA opens a WhatsApp deep link
  (`https://wa.me/<NUMBER>?text=<message>`) with a pre-filled, context-aware
  message (recommended lines + the figures the visitor produced).
- Persistent WhatsApp float button on every page (`WhatsAppFloat`, in the root layout).
- WhatsApp number is a config value driven by `NEXT_PUBLIC_WHATSAPP_NUMBER`
  (falls back to a fake placeholder). Never hardcoded; moves to Sanity in M4.
- Lead capture: `WhatsAppCTA`/float fire `captureLead()` (sendBeacon) -> `/api/lead`
  route, which forwards to `LEAD_WEBHOOK_URL` (Airtable / Google Sheet / Zapier).
  No webhook set = logs and returns OK; never blocks the WhatsApp hand-off.
- Copy pass: removed all em dashes and toned down marketing/AI-style language.

**To go live (paste your own values):** copy `.env.local.example` to `.env.local`,
set `NEXT_PUBLIC_WHATSAPP_NUMBER` and `LEAD_WEBHOOK_URL`, restart `npm run dev`.

## M4 — done

- Sanity added with an **embedded Studio at `/studio`**. Content model (spec.md §11):
  Site settings, Clusters, Lines, Testimonials, Cost figures, About content.
- All dummy content (copy, testimonials, cost figures, WhatsApp number, hero/footer
  copy) now reads from Sanity via a server data layer (`src/lib/siteData.ts`).
  Components are prop-driven; pages are async server components that fetch and pass data.
- WhatsApp number flows from Sanity → `SiteSettingsProvider` (context) → every CTA/float.
- Bundled defaults (`src/lib/defaults.ts`, `content.ts`, `costFigures.ts`) double as the
  **seed source** (`npm run seed`) and an **offline fallback** so the site runs before
  Sanity is connected.
- Route group `(site)` holds the site chrome; minimal root layout lets `/studio` render
  bare. Build passes (Studio isolated to the client graph to avoid a Turbopack SSR issue).
- Setup + edit walkthrough in `docs/sanity-setup.md`.

**Setup (yours):** create a Sanity project, add `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN` to `.env.local`, run `npm run seed`,
then edit at `/studio`. Full steps in `docs/sanity-setup.md`.
