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
          <article key={line.title} className="rounded-xl border border-slate-200 p-5">
            <div className="text-2xl" aria-hidden>
              {line.icon}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-brand">{line.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{line.blurb}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">{children}</section>
    </div>
  );
}
