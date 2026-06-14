import type { TestimonialData } from "@/lib/siteData";

// Testimonials, sourced from Sanity (spec.md §11).
export default function TestimonialBand({
  testimonials,
}: {
  testimonials: TestimonialData[];
}) {
  if (!testimonials.length) return null;

  return (
    <section className="rounded-2xl bg-brand px-6 py-10 sm:px-10">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
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
    </section>
  );
}
