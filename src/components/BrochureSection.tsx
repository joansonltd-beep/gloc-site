import { FileText } from "@/components/icons";
import { brochuresFor } from "@/lib/brochures";

// Compact brochure downloads for one product page. Renders nothing when the
// page has no mapped brochures.
export default function BrochureSection({ pageKey }: { pageKey: string }) {
  const items = brochuresFor(pageKey);
  if (!items.length) return null;

  return (
    <section aria-label="Product brochures">
      <h2 className="text-xl font-semibold text-brand">Product brochures</h2>
      <p className="mt-1 text-sm text-slate-600">
        Official product brochures for plans in this line. Click to open the PDF.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <a
            key={b.slug}
            href={b.file}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <FileText className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-slate-800 group-hover:text-brand">
                {b.title}
              </span>
              <span className="block text-xs text-slate-500">PDF brochure</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
