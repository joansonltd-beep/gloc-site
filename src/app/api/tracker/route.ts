// Storage for Roslyn Keller's activity tracker (public/roslynkeller.html).
//
// Entries live in Sanity. The dataset is publicly readable, so every document
// here has a dotted _id ("rktracker.…"): Sanity only serves those to
// token-authenticated requests. All access goes through this route, gated by
// the TRACKER_PASSCODE env var. Without that and SANITY_API_WRITE_TOKEN the
// route reports itself unconfigured and the page stays in browser-only mode.

import { createHash, timingSafeEqual } from "crypto";
import { createClient, type SanityClient } from "next-sanity";
import { projectId, dataset, isSanityConfigured } from "@/sanity/env";

const METRICS: { key: string; money?: boolean }[] = [
  { key: "prospects" },
  { key: "calls" },
  { key: "apptsSet" },
  { key: "apptsHeld" },
  { key: "closes" },
  { key: "apps" },
  { key: "premium", money: true },
  { key: "referrals" },
];
const DAY_TYPE = "rkTrackerDay";
const GOALS_TYPE = "rkTrackerGoals";
const DAY_PREFIX = "rktracker.day.";
const GOALS_ID = "rktracker.goals";
const MAX_BODY_BYTES = 1_000_000;
const MAX_IMPORT_DAYS = 5000;

type Day = Record<string, string | number>;
type Goals = { targets: Record<string, number>; workdays: number; currency: string };

let cached: SanityClient | null = null;
function client(): SanityClient {
  if (!cached) {
    cached = createClient({
      projectId,
      dataset,
      apiVersion: "2025-02-19",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
      perspective: "raw",
    });
  }
  return cached;
}

function missingConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.TRACKER_PASSCODE?.trim()) missing.push("TRACKER_PASSCODE");
  if (!process.env.SANITY_API_WRITE_TOKEN?.trim()) missing.push("SANITY_API_WRITE_TOKEN");
  if (!isSanityConfigured) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  return missing;
}

function sha(s: string): Buffer {
  return createHash("sha256").update(s, "utf8").digest();
}

function authorized(request: Request): boolean {
  const expected = process.env.TRACKER_PASSCODE?.trim() ?? "";
  const given = request.headers.get("x-tracker-passcode") ?? "";
  if (!expected || !given) return false;
  return timingSafeEqual(sha(given.trim()), sha(expected));
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function denied(): Promise<Response> {
  // Slows down passcode guessing a little; there is no shared store for a real lockout.
  await new Promise((r) => setTimeout(r, 700));
  return json({ error: "passcode" }, 401);
}

function isValidYmd(s: unknown): s is string {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function cleanDay(id: unknown, raw: unknown): Day | null {
  if (!isValidYmd(id) || !raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const out: Day = {
    date: id,
    notes: typeof d.notes === "string" ? d.notes.slice(0, 2000) : "",
    updatedAt: new Date().toISOString(),
  };
  for (const m of METRICS) {
    const v = Number(d[m.key]);
    const cap = m.money ? 100_000_000 : 100_000;
    out[m.key] = Number.isFinite(v) && v > 0 ? Math.min(cap, m.money ? Math.round(v * 100) / 100 : Math.round(v)) : 0;
  }
  return out;
}

function cleanGoals(raw: unknown): Goals | null {
  if (!raw || typeof raw !== "object") return null;
  const g = raw as Record<string, unknown>;
  const src = (g.targets && typeof g.targets === "object" ? g.targets : {}) as Record<string, unknown>;
  const targets: Record<string, number> = {};
  for (const m of METRICS) {
    const v = Number(src[m.key]);
    targets[m.key] = Number.isFinite(v) && v >= 0 ? (m.money ? Math.round(v * 100) / 100 : Math.round(v)) : 0;
  }
  const workdays = [5, 6, 7].includes(Number(g.workdays)) ? Number(g.workdays) : 5;
  const currency = typeof g.currency === "string" && g.currency.trim() ? g.currency.trim().slice(0, 4) : "$";
  return { targets, workdays, currency };
}

async function readAll() {
  const fields = ["date", "notes", "updatedAt", ...METRICS.map((m) => m.key)].join(", ");
  const [rows, goals] = await Promise.all([
    client().fetch<Day[]>(`*[_type == $t && _id in path($p)][0...${MAX_IMPORT_DAYS}]{${fields}}`, {
      t: DAY_TYPE,
      p: `${DAY_PREFIX}*`,
    }),
    client().getDocument(GOALS_ID),
  ]);
  const days: Record<string, Day> = {};
  for (const r of rows) if (isValidYmd(r.date)) days[r.date] = r;
  return {
    days,
    goals: goals ? { targets: goals.targets, workdays: goals.workdays, currency: goals.currency } : null,
  };
}

function dayDoc(day: Day) {
  return { _id: DAY_PREFIX + day.date, _type: DAY_TYPE, ...day };
}

export async function GET(request: Request): Promise<Response> {
  const missing = missingConfig();
  if (new URL(request.url).searchParams.has("probe")) {
    return json({ configured: missing.length === 0, missing });
  }
  if (missing.length) return json({ configured: false, missing }, 503);
  if (!authorized(request)) return denied();
  try {
    return json({ configured: true, ...(await readAll()) });
  } catch (err) {
    console.error("[tracker] read failed:", err);
    return json({ error: "unavailable" }, 502);
  }
}

export async function POST(request: Request): Promise<Response> {
  const missing = missingConfig();
  if (missing.length) return json({ configured: false, missing }, 503);
  if (!authorized(request)) return denied();

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  try {
    switch (body.op) {
      case "setDay": {
        const day = cleanDay(body.id, body.data);
        if (!day) return json({ error: "bad_request" }, 400);
        await client().createOrReplace(dayDoc(day));
        return json({ ok: true });
      }
      case "deleteDay": {
        if (!isValidYmd(body.id)) return json({ error: "bad_request" }, 400);
        await client().delete(DAY_PREFIX + body.id);
        return json({ ok: true });
      }
      case "setGoals": {
        const goals = cleanGoals(body.data);
        if (!goals) return json({ error: "bad_request" }, 400);
        await client().createOrReplace({ _id: GOALS_ID, _type: GOALS_TYPE, ...goals });
        return json({ ok: true });
      }
      case "import": {
        // "merge" adds days the site doesn't have yet; "replace" makes the site match the upload.
        const mode = body.mode === "replace" ? "replace" : "merge";
        const src = body.days && typeof body.days === "object" ? (body.days as Record<string, unknown>) : null;
        if (!src) return json({ error: "bad_request" }, 400);
        const ids = Object.keys(src);
        if (ids.length > MAX_IMPORT_DAYS) return json({ error: "too_large" }, 413);
        const days = ids.map((id) => cleanDay(id, src[id])).filter((d): d is Day => d !== null);
        const goals = body.goals ? cleanGoals(body.goals) : null;

        const existing = await client().fetch<string[]>(`*[_type == $t && _id in path($p)]._id`, {
          t: DAY_TYPE,
          p: `${DAY_PREFIX}*`,
        });
        const incoming = new Set(days.map((d) => DAY_PREFIX + d.date));
        const ops: ((tx: ReturnType<SanityClient["transaction"]>) => void)[] = [];
        for (const d of days) {
          ops.push((tx) => (mode === "replace" ? tx.createOrReplace(dayDoc(d)) : tx.createIfNotExists(dayDoc(d))));
        }
        if (mode === "replace") {
          for (const id of existing) if (!incoming.has(id)) ops.push((tx) => tx.delete(id));
        }
        if (goals) {
          const doc = { _id: GOALS_ID, _type: GOALS_TYPE, ...goals };
          ops.push((tx) => (mode === "replace" ? tx.createOrReplace(doc) : tx.createIfNotExists(doc)));
        }
        for (let i = 0; i < ops.length; i += 200) {
          const tx = client().transaction();
          ops.slice(i, i + 200).forEach((op) => op(tx));
          await tx.commit();
        }
        return json({ ok: true, days: days.length });
      }
      default:
        return json({ error: "bad_request" }, 400);
    }
  } catch (err) {
    console.error("[tracker] write failed:", err);
    return json({ error: "unavailable" }, 502);
  }
}
