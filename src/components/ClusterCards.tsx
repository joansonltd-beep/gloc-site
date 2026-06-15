import Link from "next/link";
import type { ClusterData } from "@/lib/siteData";

// Four need-clusters, equal weight, no single "anchor" product (spec.md §4).
export default function ClusterCards({ clusters }: { clusters: ClusterData[] }) {
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
        {clusters.map((c) => (
          <Link
            key={c.key}
            href={`/${c.key}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {/* Swoosh accent that brightens on hover. */}
            <span className="absolute inset-x-0 top-0 h-1 bg-swoosh opacity-60 transition group-hover:opacity-100" />
            <span className="mt-1 text-xs font-medium uppercase tracking-wide text-accent-dark">
              {c.intent}
            </span>
            <span className="mt-2 text-lg font-semibold text-brand">
              {c.title}
            </span>
            <span className="mt-1 flex-1 text-sm text-slate-600">{c.lines}</span>
            <span className="mt-4 text-sm font-medium text-brand">
              Explore {c.title}{" "}
              <span className="inline-block transition group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
