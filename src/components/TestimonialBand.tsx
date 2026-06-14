import { TESTIMONIALS } from "@/lib/content";

// Dummy testimonials (move to Sanity in M4).
export default function TestimonialBand() {
  return (
    <section className="rounded-2xl bg-brand px-6 py-10 sm:px-10">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        Real people, real peace of mind
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.person}
            className="flex flex-col rounded-xl bg-white/5 p-5 ring-1 ring-white/10"
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-white/90">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4">
              <p className="text-sm font-semibold text-white">{t.person}</p>
              <p className="text-xs text-accent">{t.line}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/40">Dummy testimonials — placeholder.</p>
    </section>
  );
}
