// Server-side data layer (spec.md §11).
// Every page fetches content through these functions. When Sanity is configured
// they return CMS content; otherwise (or on error, or before seeding) they
// return the bundled defaults, so the site always renders.

import "server-only";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { CLUSTERS, LINES, TESTIMONIALS, type ClusterKey } from "@/lib/content";
import { DEFAULT_COST_FIGURE_VALUES } from "@/lib/costFigures";
import {
  DEFAULT_SETTINGS,
  DEFAULT_ABOUT,
  DEFAULT_CALCULATOR,
  DEFAULT_ILLNESS_COSTS,
  type SiteSettings,
  type AboutData,
  type CalculatorSettings,
  type IllnessCost,
} from "@/lib/defaults";

export type { SiteSettings, AboutData, CalculatorSettings, IllnessCost };

// --- normalized types the components consume ---------------------------
export type ClusterData = {
  key: ClusterKey;
  title: string;
  intent: string;
  lines: string;
};

export type LineData = {
  title: string;
  blurb: string;
  icon: string;
  clusterKey: ClusterKey;
};

export type TestimonialData = {
  quote: string;
  person: string;
  relatedLine: string;
};

// --- bundled defaults (seed + offline fallback) ------------------------
const DEFAULT_CLUSTERS: ClusterData[] = CLUSTERS.map((c) => ({
  key: c.key,
  title: c.title,
  intent: c.intent,
  lines: c.lines,
}));

const DEFAULT_LINES: LineData[] = (
  Object.keys(LINES) as ClusterKey[]
).flatMap((k) => LINES[k].map((l) => ({ ...l, clusterKey: k })));

const DEFAULT_TESTIMONIALS: TestimonialData[] = TESTIMONIALS.map((t) => ({
  quote: t.quote,
  person: t.person,
  relatedLine: t.line,
}));

// --- GROQ ---------------------------------------------------------------
const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  whatsappNumber, glocAffiliationLine, footerDisclaimer,
  agentName, agentTagline, heroEyebrow, heroHeadline, heroSubcopy,
  "headshotUrl": headshot.asset->url,
  "logoUrl": logo.asset->url
}`;
const CLUSTERS_QUERY = `*[_type == "cluster"]|order(order asc){key, title, intent, lines}`;
const LINES_QUERY = `*[_type == "line"]|order(order asc){title, blurb, icon, "clusterKey": cluster->key}`;
const TESTIMONIALS_QUERY = `*[_type == "testimonial"]|order(order asc){quote, person, relatedLine}`;
const COST_FIGURES_QUERY = `*[_type == "costFigure"]{key, value}`;
const ABOUT_QUERY = `*[_type == "aboutContent"][0]{
  teaser, story, videoUrl, credentials,
  "videoFileUrl": videoFile.asset->url
}`;
const CALCULATOR_QUERY = `*[_type == "calculatorSettings"][0]{
  investmentLowReturn, investmentHighReturn,
  pensionSavingsReturn, pensionStructuredReturn, pensionInflation
}`;
const ILLNESS_COSTS_QUERY = `*[_type == "illnessCost"]|order(order asc){
  condition, costLow, costHigh, unit, note
}`;

// Cache CMS reads for a minute; edits show up shortly after publishing.
const fetchOpts = { next: { revalidate: 60 } } as const;

function stripNulls<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== "")
  ) as Partial<T>;
}

async function query<T>(groq: string): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await getClient().fetch<T>(groq, {}, fetchOpts);
  } catch {
    return null;
  }
}

// --- public fetchers ----------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await query<Partial<SiteSettings>>(SETTINGS_QUERY);
  return res ? { ...DEFAULT_SETTINGS, ...stripNulls(res) } : DEFAULT_SETTINGS;
}

export async function getClusters(): Promise<ClusterData[]> {
  const res = await query<ClusterData[]>(CLUSTERS_QUERY);
  return res?.length ? res : DEFAULT_CLUSTERS;
}

export async function getCluster(key: ClusterKey): Promise<ClusterData> {
  const all = await getClusters();
  return all.find((c) => c.key === key) ?? DEFAULT_CLUSTERS.find((c) => c.key === key)!;
}

export async function getLines(clusterKey?: ClusterKey): Promise<LineData[]> {
  const res = await query<LineData[]>(LINES_QUERY);
  const all = res?.length ? res : DEFAULT_LINES;
  return clusterKey ? all.filter((l) => l.clusterKey === clusterKey) : all;
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  const res = await query<TestimonialData[]>(TESTIMONIALS_QUERY);
  return res?.length ? res : DEFAULT_TESTIMONIALS;
}

export async function getCostFigures(): Promise<Record<string, number>> {
  const res = await query<{ key: string; value: number }[]>(COST_FIGURES_QUERY);
  if (!res?.length) return DEFAULT_COST_FIGURE_VALUES;
  // Start from defaults so a missing row never breaks a tool.
  const map = { ...DEFAULT_COST_FIGURE_VALUES };
  for (const f of res) if (f.key && typeof f.value === "number") map[f.key] = f.value;
  return map;
}

export async function getAbout(): Promise<AboutData> {
  const res = await query<Partial<AboutData>>(ABOUT_QUERY);
  return res ? { ...DEFAULT_ABOUT, ...stripNulls(res) } : DEFAULT_ABOUT;
}

export async function getCalculatorSettings(): Promise<CalculatorSettings> {
  const res = await query<Record<string, number | null>>(CALCULATOR_QUERY);
  if (!res) return DEFAULT_CALCULATOR;
  // Sanity stores percentages (e.g. 2.5); convert to decimals (0.025).
  const out = { ...DEFAULT_CALCULATOR };
  for (const k of Object.keys(out) as (keyof CalculatorSettings)[]) {
    const v = res[k];
    if (typeof v === "number") out[k] = v / 100;
  }
  return out;
}

export async function getIllnessCosts(): Promise<IllnessCost[]> {
  const res = await query<IllnessCost[]>(ILLNESS_COSTS_QUERY);
  return res?.length ? res : DEFAULT_ILLNESS_COSTS;
}
