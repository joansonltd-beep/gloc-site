# Build Plan — Guardian Group Agent Website

Milestones from `spec.md` §13. Build in order, one at a time.

- [x] **M0 — Scaffold:** Next.js (App Router, TS) + Tailwind + Git + route structure + todo.md
- [x] **M1 — Landing page + Needs-Router** with placeholder (dummy) content
- [ ] **M2 — Cluster hub pages + the five interactive tools** (dummy data)
- [ ] **M3 — WhatsApp lead flow** wired across all CTAs and tools
- [ ] **M4 — Sanity CMS integration;** move all content into editable fields
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
