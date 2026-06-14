/**
 * One-time seed: pushes the bundled default content into Sanity so the agent
 * can edit it in Studio (spec.md §11).
 *
 * Run after setting NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * and SANITY_API_WRITE_TOKEN in .env.local:
 *
 *   npm run seed
 *
 * Idempotent: uses fixed document ids + createOrReplace, so re-running it
 * resets the seeded docs to these defaults (your later Studio edits to OTHER
 * fields are overwritten, so only run it once at setup).
 */
import { createClient } from "@sanity/client";
import { CLUSTERS, LINES, TESTIMONIALS, type ClusterKey } from "../src/lib/content";
import { DEFAULT_COST_FIGURES } from "../src/lib/costFigures";
import { DEFAULT_SETTINGS, DEFAULT_ABOUT } from "../src/lib/defaults";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

function clusterId(key: ClusterKey) {
  return `cluster-${key}`;
}

async function run() {
  const tx = client.transaction();

  // Singletons
  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    whatsappNumber: DEFAULT_SETTINGS.whatsappNumber,
    glocAffiliationLine: DEFAULT_SETTINGS.glocAffiliationLine,
    footerDisclaimer: DEFAULT_SETTINGS.footerDisclaimer,
    agentName: DEFAULT_SETTINGS.agentName,
    agentTagline: DEFAULT_SETTINGS.agentTagline,
    heroEyebrow: DEFAULT_SETTINGS.heroEyebrow,
    heroHeadline: DEFAULT_SETTINGS.heroHeadline,
    heroSubcopy: DEFAULT_SETTINGS.heroSubcopy,
  });

  tx.createOrReplace({
    _id: "aboutContent",
    _type: "aboutContent",
    teaser: DEFAULT_ABOUT.teaser,
  });

  // Clusters
  CLUSTERS.forEach((c, i) => {
    tx.createOrReplace({
      _id: clusterId(c.key),
      _type: "cluster",
      key: c.key,
      title: c.title,
      intent: c.intent,
      lines: c.lines,
      order: i,
    });
  });

  // Lines (reference their cluster)
  (Object.keys(LINES) as ClusterKey[]).forEach((key) => {
    LINES[key].forEach((line, i) => {
      tx.createOrReplace({
        _id: `line-${key}-${i}`,
        _type: "line",
        title: line.title,
        blurb: line.blurb,
        icon: line.icon,
        cluster: { _type: "reference", _ref: clusterId(key) },
        order: i,
      });
    });
  });

  // Testimonials
  TESTIMONIALS.forEach((t, i) => {
    tx.createOrReplace({
      _id: `testimonial-${i}`,
      _type: "testimonial",
      quote: t.quote,
      person: t.person,
      relatedLine: t.line,
      order: i,
    });
  });

  // Cost figures
  DEFAULT_COST_FIGURES.forEach((f) => {
    tx.createOrReplace({
      _id: `costFigure-${f.key}`,
      _type: "costFigure",
      key: f.key,
      label: f.label,
      value: f.value,
      note: f.note,
      order: f.order,
    });
  });

  await tx.commit();
  console.log(
    `Seeded: site settings, about, ${CLUSTERS.length} clusters, ${
      Object.values(LINES).flat().length
    } lines, ${TESTIMONIALS.length} testimonials, ${DEFAULT_COST_FIGURES.length} cost figures.`
  );
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
