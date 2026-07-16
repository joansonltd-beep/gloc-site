"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, FileText } from "@/components/icons";
import type { Brochure } from "@/lib/brochures";

// Horizontal snap carousel of brochure cards with arrow controls.
export default function BrochureCarousel({ brochures }: { brochures: Brochure[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
        aria-label="Brochure carousel"
      >
        {brochures.map((b) => (
          <a
            key={b.slug}
            href={b.file}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-60 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
              <FileText className="h-12 w-12 text-white/80 transition group-hover:scale-105" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-800 group-hover:text-brand">{b.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{b.category}</p>
              <p className="mt-3 text-sm font-medium text-brand">
                View brochure{" "}
                <span className="inline-block transition group-hover:translate-x-0.5">→</span>
              </p>
            </div>
          </a>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll brochures left"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-md transition hover:bg-brand hover:text-white sm:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll brochures right"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-md transition hover:bg-brand hover:text-white sm:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
