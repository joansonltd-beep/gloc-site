import Link from "next/link";
import { CLUSTERS } from "@/lib/content";

// Four need-clusters, equal weight, no single "anchor" product (spec.md §4).
export default function ClusterCards() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-brand">
          The full portfolio
        </h2>
        <p className="mt-1 text-slate-600">
          Four ways I can help. Pick the one that matches where you are.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CLUSTERS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group flex flex-col rounded-xl border border-slate-200 p-5 transition hover:border-brand hover:shadow-sm"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent-dark">
              {c.intent}
            </span>
            <span className="mt-2 text-lg font-semibold text-brand">
              {c.title}
            </span>
            <span className="mt-1 flex-1 text-sm text-slate-600">
              {c.lines}
            </span>
            <span className="mt-4 text-sm font-medium text-brand">
              Explore {c.title} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
