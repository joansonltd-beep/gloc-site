import Link from "next/link";
import { slugify } from "@/lib/content";
import { LineIcon } from "@/components/icons";
import type { ClusterData, LineData } from "@/lib/siteData";

// Shared hub header + line sections for a cluster page (spec.md §4, §5).
// linkLines: render the subtitle as links to each line's detail page.
// linesLast: place the line cards after the children (tools) instead of before.
export default function ClusterHub({
  cluster,
  lines,
  linkLines = false,
  linesLast = false,
  children,
}: {
  cluster: ClusterData;
  lines: LineData[];
  linkLines?: boolean;
  linesLast?: boolean;
  children: React.ReactNode; // the tool(s) for this cluster
}) {
  const lineCards = (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lines.map((line) => (
        <Link
          key={line.title}
          href={`/${cluster.key}/${slugify(line.title)}`}
          className="group flex flex-col rounded-xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <LineIcon slug={slugify(line.title)} className="h-6 w-6" />
          </span>
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
  );

  return (
    <div className="space-y-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
          {cluster.intent}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          {cluster.title}
        </h1>
        {linkLines ? (
          <p className="mt-2 text-slate-600">
            {lines.map((line, i) => (
              <span key={line.title}>
                {i > 0 ? (
                  <span aria-hidden className="text-slate-300"> · </span>
                ) : null}
                <Link
                  href={`/${cluster.key}/${slugify(line.title)}`}
                  className="font-medium text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded"
                >
                  {line.title}
                </Link>
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-2 text-slate-600">{cluster.lines}</p>
        )}
      </header>

      {!linesLast && lineCards}

      <section className="space-y-12">{children}</section>

      {linesLast && lineCards}
    </div>
  );
}
