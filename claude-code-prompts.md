# Claude Code Prompt Script — Guardian Group Agent Website

A milestone-by-milestone script. Paste **one prompt at a time**, let Claude Code finish and verify, commit, then move to the next. The `spec.md` file is the source of truth — keep it in your project folder.

---

## Before you start (one-time setup)

1. Install **Node.js 18+** from nodejs.org.
2. Install the **Claude desktop app** and open the **Code** section (no terminal needed).
3. Create an empty project folder, e.g. `gloc-site`, and drop `spec.md` inside it.
4. Point Claude Code at that folder.
5. Have these ready as you go (Claude Code will ask): a domain, and accounts for **Vercel**, **Sanity**, and **WhatsApp Business** (note your number as `1868XXXXXXX`).

**Golden rules:** one milestone at a time · let it finish before the next · if something looks wrong, tell it plainly what's wrong and ask it to fix · commit after each milestone.

---

## M0 — Scaffold the project

```
Read spec.md fully. This is the source of truth for the whole project; reread it before each milestone.

Now do Milestone M0 only:
- Set up a Next.js app (App Router, TypeScript) with Tailwind CSS in this folder.
- Initialize Git and make a first commit.
- Create the folder/route structure for these pages: /, /protect, /grow, /assets, /business, /about, /results, /book — each as a simple placeholder for now.
- Create a todo.md that lists all milestones M0–M7 from the spec with checkboxes, and tick M0 when done.
- Run the dev server and tell me the local URL so I can see it.

Do not build any real content or tools yet. Stop after M0 and summarize what you did.
```
**Check:** the site opens locally and you can click between blank pages.

---

## M1 — Landing page + Needs-Router (dummy content)

```
Do Milestone M1 only, per spec.md sections 6 and 9.

Build the landing page:
- An agent-led hero (use a placeholder headshot block and headline aimed at a 25–35 Trinidadian professional). Put a small "Authorized Guardian Representative" placeholder where the GLOC mark will go.
- The Needs-Discovery Router Step 1 with the five cards from the spec, each linking to the right page.
- The "Not sure" card opens the 4-question discovery flow that returns 2–3 recommended lines with a one-line reason each (use placeholder logic for now).
- Below the router: the four cluster cards, a testimonial band (dummy testimonials), an About teaser, and a footer with a disclaimer placeholder.

Use clean, modern, mobile-first design with a restrained palette. Dummy content is fine. Update todo.md. Stop and show me.
```
**Check:** on your phone-sized browser window, the hero reads well, the five cards work, and the discovery flow returns suggestions.

---

## M2 — Cluster hubs + the five tools (dummy data)

```
Do Milestone M2 only, per spec.md sections 4, 5, and 7.

Build the four cluster hub pages, each with its lines and its tool:
- /protect: Life, Health, Critical Illness sections + the Protection Planner tool.
- /grow: Pension/Annuities + Investments sections + the Pension-vs-Inflation projector and the Investment growth projector.
- /assets: motor/home/property + the quick-quote request.
- /business: group/employee benefits + the enquiry form.

Build each tool as its own reusable component. Use the placeholder cost figures from spec.md section 10, clearly labeled and easy to edit. Tool results should show a clear outcome and a CTA button (we'll wire the actual WhatsApp link in M3). Update todo.md. Stop and show me.
```
**Check:** each tool takes inputs and produces a sensible result. Numbers don't have to be final.

---

## M3 — Wire the WhatsApp lead flow

```
Do Milestone M3 only, per spec.md section 8.

- Make every CTA and every tool result open a WhatsApp deep link in the format https://wa.me/<NUMBER>?text=<message>.
- Pre-fill each message with context: which line(s) were recommended and any figures the visitor produced.
- Add a persistent WhatsApp float button on every page.
- For now use a placeholder number from a config value (do not hardcode it; we'll move it to Sanity in M4).
- Also send each submission to a simple capture (set up an Airtable or Google Sheet webhook and show me how to add my own endpoint).

Update todo.md. Stop and show me, and tell me exactly where to paste my WhatsApp number and capture endpoint.
```
**Check:** tapping a CTA opens WhatsApp with a pre-written message. Test on a real phone.

---

## M4 — Sanity CMS (make everything editable)

```
Do Milestone M4 only, per spec.md section 11.

- Add Sanity to the project and set up Sanity Studio.
- Create the content model: Site settings (WhatsApp number, GLOC affiliation line, footer disclaimer), Lines, Clusters, Testimonials, Cost figures, About content.
- Move ALL existing dummy content (copy, testimonials, cost figures, WhatsApp number) out of the code and into Sanity so I can edit it myself without touching code.
- Walk me through logging into Sanity Studio and editing one item end-to-end.

Update todo.md. Stop and show me.
```
**Check:** you change a testimonial or a cost figure in Sanity Studio and it updates on the site.

---

## M5 — Remaining pages + polish + mobile QA

```
Do Milestone M5 only.

- Build /about (agent story, credentials, and an embedded HeyGen video — I'll give you the video URL), /results (testimonials hub from Sanity), and a /book placeholder.
- Do a full design polish pass: consistent spacing, type hierarchy, hover/active states, fast image loading.
- Do a mobile QA pass on a phone-sized viewport and fix anything cramped or hard to tap.
- Add basic SEO (page titles, descriptions) and accessibility (alt text, contrast, keyboard nav).

Update todo.md. Stop and show me a checklist of what you polished.
```
**Check:** the whole site feels finished and works cleanly on a phone.

---

## M6 — Deploy to Vercel + connect domain

```
Do Milestone M6 only, per spec.md section 3.

- Push the project to a new GitHub repo.
- Walk me step by step through deploying it on Vercel (I'll do the clicks; you tell me exactly what to click).
- Then walk me through connecting my custom domain and confirming HTTPS is live.
- Give me a final pre-launch checklist based on spec.md (including: confirm GLOC logo sign-off is in hand before showing the logo, and confirm cost figures against a real facility quote).

Update todo.md. Stop after the site is live and summarize the live URL and next steps.
```
**Check:** the site loads at your real domain over HTTPS.

---

## M7 — Later: modules (only when lead volume justifies)

```
Do Milestone M7. Per spec.md section 12, the slots already exist.
- Add an AI chat qualifier: a chat widget that asks 2–3 qualifying questions and routes hot leads to my WhatsApp, aware of which cluster the visitor explored.
- Add booking automation on /book: a calendar booking flow, triggered from chat and CTAs.
Walk me through any accounts or keys I need. Update todo.md.
```

---

## If something goes wrong
- Tell Claude Code plainly: "On the /protect page the planner result shows the wrong number — it should be X. Please fix and show me."
- Ask it to commit before risky changes: "Commit first, then try this."
- To undo: "Revert to the last commit."
- Keep each request scoped to one thing; it works best in small, clear steps.
