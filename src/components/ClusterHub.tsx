import Link from "next/link";
import { slugify } from "@/lib/content";
import type { ClusterData, LineData } from "@/lib/siteData";

// Shared hub header + line sections for a cluster page (spec.md §4, §5).
export default function ClusterHub({
  cluster,
  lines,
  children,
}: {
  cluster: ClusterData;
  lines: LineData[];
  children: React.ReactNode; // the tool(s) for this cluster
}) {
  return (
    <div className="space-y-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
          {cluster.intent}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          {cluster.title}
        </h1>
        <p className="mt-2 text-slate-600">{cluster.lines}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lines.map((line) => (
          <Link
            key={line.title}
            href={`/${cluster.key}/${slugify(line.title)}`}
            className="group flex flex-col rounded-xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <div className="text-2xl" aria-hidden>
              {line.icon}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-brand">{line.title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-600">{line.blurb}</p>
            <span className="mt-3 text-sm font-medium text-brand">
              Learn more{" "}
              <span className="inline-block transition group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </section>

      <section className="space-y-6">{children}</section>
    </div>
  );
}
