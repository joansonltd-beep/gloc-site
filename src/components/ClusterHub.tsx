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
          href={`/${cluster.key}/${line.icon || slugify(line.title)}`}
          className="group flex flex-col rounded-xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <span className="block w-full">
            <LineIcon
              slug={line.icon || slugify(line.title)}
              className="aspect-[4/3] h-auto w-full"
            />
          </span>
          <h2 className="mt-3 text-lg font-semibold text-brand">
            {line.title}
          </h2>
          <p className="mt-1 flex-1 text-sm text-slate-600">{line.blurb}</p>
          <span className="mt-3 text-sm font-medium text-brand">
            Compare your options{" "}
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
          {cluster.title} in Jamaica
        </h1>
        {linkLines ? (
          <p className="mt-2 text-slate-600">
            {lines.map((line, i) => (
              <span key={line.title}>
                {i > 0 ? (
                  <span aria-hidden className="text-slate-300">
                    {" "}
                    ·{" "}
                  </span>
                ) : null}
                <Link
                  href={`/${cluster.key}/${line.icon || slugify(line.title)}`}
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

      <p className="max-w-2xl text-slate-600">Joanson Baptiste James helps you understand and compare options from multiple insurers across Jamaica. We explain benefits, exclusions and costs so you can choose with confidence.</p>
      {!linesLast && lineCards}

      <section className="space-y-12">{children}</section>

      {linesLast && lineCards}
      <section className="rounded-2xl bg-brand p-6 text-white"><h2 className="text-xl font-semibold">Not sure where to start? Book a no-pressure consultation.</h2><Link href="/book" className="button-gold mt-4">Book a consultation</Link></section>
    </div>
  );
}
