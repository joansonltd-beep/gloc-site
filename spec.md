# spec.md — Guardian Group Agent Website

> This is the single source of truth for the project. Claude Code: read this file fully before doing anything. Build only what the current milestone asks for. Keep this file updated if decisions change.

---

## 1. What we're building
A high-conversion, mobile-first website for an independent Guardian Group insurance agent in Trinidad & Tobago. It presents the agent's **full portfolio** with equal weight and routes each visitor, by need, to the right product line. The agent's personal brand leads; Guardian/GLOC appears as the institution that backs them.

**Primary goal:** turn visitors into WhatsApp conversations.

## 2. Audience (priority order)
1. Young professionals 20–35
2. Young families (mortgage-stage)
3. Business owners
4. Energy-sector high-net-worth

Write copy and choose imagery for #1 first, but never alienate the others.

## 3. Tech stack (non-negotiable)
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Sanity** headless CMS for all editable content
- **Vercel** for hosting/deploy
- No backend database beyond Sanity + a simple lead capture (Airtable or a Google Sheet via webhook is fine to start)

## 4. The portfolio — four need-clusters (equal weight)
| Cluster | Lines | Visitor intent |
|---|---|---|
| **Protect** | Life · Health · Critical Illness | Keep my family safe |
| **Grow** | Pension/Annuities · Investments/Mutual funds | Build wealth, beat inflation |
| **Assets** | General insurance — motor / home / property | Insure what I own |
| **Business** | Group / employee benefits | Cover my team |

No single product is the "anchor." The needs-router does the sorting.

## 5. Sitemap
```
/            Landing — agent hero + Needs-Discovery Router
/protect     Life · Health · Critical Illness + Protection Planner tool
/grow        Pension/Annuities · Investments + two projector tools
/assets      Motor / home / property + quick-quote request
/business    Group/employee benefits + enquiry form
/about       Agent story, credentials, HeyGen video
/results     Testimonials
/book        Booking (module added later)
Global: WhatsApp float button on every page + AI-chat-qualifier slot (later)
```

## 6. The Needs-Discovery Router (landing centerpiece)
**Step 1 — "What brings you here today?"** five cards:
1. Protect my family → /protect
2. Plan retirement & grow my money → /grow
3. Insure my car, home or property → /assets
4. Cover my business & staff → /business
5. Not sure — help me figure it out → discovery flow

**Discovery flow:** 4 quick questions — life stage, dependents (y/n), own or rent, business owner (y/n) — then return 2–3 recommended lines, each with a one-line "why" and a WhatsApp CTA.

## 7. Interactive tools
- **Protection Planner** (/protect): inputs = monthly income, dependents, existing cover. Output = combined need across life cover, health gap, and a critical-illness lump sum. Uses the cost figures in §10. Result ends in a WhatsApp CTA.
- **Pension-vs-Inflation projector** (/grow): inputs = current age, monthly contribution, retirement age. Output = projected value, savings-only vs. structured plan, showing TT-dollar erosion.
- **Investment growth projector** (/grow): inputs = lump sum and/or monthly contribution + horizon → projected value range.
- **Quick-quote request** (/assets): asset type + basic details → WhatsApp with details pre-filled.
- **Group benefits enquiry** (/business): headcount + current cover (y/n) → WhatsApp/booking.

Build each tool as a self-contained, reusable component. All math/assumptions must be clearly labeled and easy to edit.

## 8. Lead flow — WhatsApp-first
- Every CTA and tool result opens a WhatsApp deep link:
  `https://wa.me/<NUMBER>?text=<pre-filled context message>`
- Pre-fill the message with the recommended line(s) and any computed figures.
  Example: "Hi — the planner suggested Life + Critical Illness for me. I'd like to talk options."
- Persistent WhatsApp float button on all pages.
- Also POST each submission to a simple store (Airtable/Sheet webhook) so later modules have data.
- WhatsApp number is a config value (in Sanity site settings), never hardcoded.

## 9. Brand & design direction
- **Agent-led:** the agent's headshot/HeyGen video and name lead the hero. Guardian/GLOC logo appears as a smaller "Authorized Representative" endorsement.
- **Feel:** trustworthy, warm, local, modern. Speak to a 28-year-old Trini professional, not a compliance department.
- **Design:** intentional, not templated. A restrained palette anchored to Guardian's brand colors, a clear type hierarchy, generous whitespace, real photography over stock. Mobile-first — most traffic is on phones. Fast load.
- **Accessibility:** legible contrast, keyboard-navigable, alt text.

## 10. Editable cost benchmarks (placeholders — VERIFY before launch)
Store these as Sanity fields so the agent can update them. Current figures are starting points only and must be confirmed against a live private-facility quote:
- Major orthopedic surgery (e.g. hip): TT$25,000–40,000 + TT$10,000–15,000 post-op
- Dialysis: ~TT$1,200/session + TT$550+ meds → TT$15,000+/month at 3×/week (dated figure — re-quote)
- Local individual health plan: ~TT$300–1,500/month by age & cover

## 11. CMS (Sanity) content model
- **Site settings:** WhatsApp number, GLOC affiliation line, footer disclaimer
- **Lines:** title, blurb, icon, cluster
- **Clusters:** Protect / Grow / Assets / Business
- **Testimonials:** quote, person, related line
- **Cost figures:** scenario + value (feeds Protection Planner)
- **About content:** story, video URL, credentials

## 12. Constraints
- Do NOT publish or display the GLOC logo until the agent confirms written sign-off (track as a launch blocker, not a code task).
- Do NOT hardcode the WhatsApp number, cost figures, or testimonials — all live in Sanity.
- Keep components modular so new lines/modules can be added without rewrites.
- Pre-wire empty "slots" for a future AI chat qualifier and booking module, but don't build them yet.

## 13. Milestones (build in order, one at a time)
- **M0** Scaffold: Next.js + Tailwind + Git + project structure + todo.md
- **M1** Landing page + Needs-Router with placeholder (dummy) content
- **M2** Cluster hub pages + the five interactive tools (dummy data)
- **M3** WhatsApp lead flow wired across all CTAs and tools
- **M4** Sanity CMS integration; move all content into editable fields
- **M5** /about, /results, /book pages + design polish + mobile QA
- **M6** Deploy to Vercel + connect domain
- **M7** (later) AI chat qualifier + booking module
