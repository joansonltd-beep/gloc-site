import type { TestimonialData } from "@/lib/siteData";

// Testimonials, sourced from Sanity (spec.md §11).
export default function TestimonialBand({
  testimonials,
}: {
  testimonials: TestimonialData[];
}) {
  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden bg-brand-dark px-6 py-10 sm:px-10">
      {/* Warm swoosh glow in the corner. */}
      <div className="relative">
      <h2 className="mt-4 text-2xl font-semibold text-white">
        What clients say
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.person}
            className="flex flex-col rounded-xl bg-white/5 p-5 ring-1 ring-white/10"
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-white/90">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4">
              <p className="text-sm font-semibold text-white">{t.person}</p>
              {t.relatedLine ? (
                <p className="text-xs text-accent">{t.relatedLine}</p>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
      </div>
    </section>
  );
}
