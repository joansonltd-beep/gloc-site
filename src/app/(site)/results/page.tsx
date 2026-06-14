import type { Metadata } from "next";
import { getTestimonials } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Results",
  description:
    "What clients across Trinidad & Tobago say about working with their Guardian Group adviser.",
};

export default async function ResultsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
          Results
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          What clients say
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Real people across Trinidad & Tobago who sorted out their cover and felt
          better for it.
        </p>
      </header>

      {testimonials.length === 0 ? (
        <p className="text-slate-500">Testimonials are on the way.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.person}
              className="flex flex-col rounded-2xl border border-slate-200 p-6"
            >
              <blockquote className="flex-1 text-slate-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-semibold text-brand">{t.person}</p>
                {t.relatedLine ? (
                  <p className="text-xs text-accent-dark">{t.relatedLine}</p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
