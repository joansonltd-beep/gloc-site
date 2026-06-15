/**
 * Seed: pushes the bundled default content into Sanity so the agent can edit it
 * in Studio (spec.md §11).
 *
 * Run after setting NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * and SANITY_API_WRITE_TOKEN in .env.local:
 *
 *   npm run seed
 *
 * Uses fixed document ids + createIfNotExists, so it only creates documents
 * that don't exist yet. Re-running is SAFE: it never overwrites edits you've
 * made in Studio, and it fills in any newly-added content types.
 */
import { createClient } from "@sanity/client";
import { CLUSTERS, LINES, TESTIMONIALS, type ClusterKey } from "../src/lib/content";
import { DEFAULT_COST_FIGURES } from "../src/lib/costFigures";
import {
  DEFAULT_SETTINGS,
  DEFAULT_ABOUT,
  DEFAULT_CALCULATOR,
  DEFAULT_ILLNESS_COSTS,
} from "../src/lib/defaults";

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

const clusterId = (key: ClusterKey) => `cluster-${key}`;

async function run() {
  const tx = client.transaction();

  tx.createIfNotExists({
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

  tx.createIfNotExists({
    _id: "aboutContent",
    _type: "aboutContent",
    teaser: DEFAULT_ABOUT.teaser,
  });

  // Calculator settings stored as percentages (decimals * 100).
  tx.createIfNotExists({
    _id: "calculatorSettings",
    _type: "calculatorSettings",
    investmentLowReturn: DEFAULT_CALCULATOR.investmentLowReturn * 100,
    investmentHighReturn: DEFAULT_CALCULATOR.investmentHighReturn * 100,
    pensionSavingsReturn: DEFAULT_CALCULATOR.pensionSavingsReturn * 100,
    pensionStructuredReturn: DEFAULT_CALCULATOR.pensionStructuredReturn * 100,
    pensionInflation: DEFAULT_CALCULATOR.pensionInflation * 100,
  });

  CLUSTERS.forEach((c, i) => {
    tx.createIfNotExists({
      _id: clusterId(c.key),
      _type: "cluster",
      key: c.key,
      title: c.title,
      intent: c.intent,
      lines: c.lines,
      order: i,
    });
  });

  (Object.keys(LINES) as ClusterKey[]).forEach((key) => {
    LINES[key].forEach((line, i) => {
      tx.createIfNotExists({
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

  TESTIMONIALS.forEach((t, i) => {
    tx.createIfNotExists({
      _id: `testimonial-${i}`,
      _type: "testimonial",
      quote: t.quote,
      person: t.person,
      relatedLine: t.line,
      order: i,
    });
  });

  DEFAULT_COST_FIGURES.forEach((f) => {
    tx.createIfNotExists({
      _id: `costFigure-${f.key}`,
      _type: "costFigure",
      key: f.key,
      label: f.label,
      value: f.value,
      note: f.note,
      order: f.order,
    });
  });

  DEFAULT_ILLNESS_COSTS.forEach((c, i) => {
    tx.createIfNotExists({
      _id: `illnessCost-${i}`,
      _type: "illnessCost",
      condition: c.condition,
      costLow: c.costLow ?? undefined,
      costHigh: c.costHigh ?? undefined,
      unit: c.unit,
      note: c.note,
      order: i,
    });
  });

  await tx.commit();
  console.log(
    `Seed complete (createIfNotExists): settings, about, calculator settings, ` +
      `${CLUSTERS.length} clusters, ${Object.values(LINES).flat().length} lines, ` +
      `${TESTIMONIALS.length} testimonials, ${DEFAULT_COST_FIGURES.length} cost figures, ` +
      `${DEFAULT_ILLNESS_COSTS.length} illness costs.`
  );
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
