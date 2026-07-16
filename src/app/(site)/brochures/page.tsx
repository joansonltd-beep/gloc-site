import type { Metadata } from "next";
import BrochureCarousel from "@/components/BrochureCarousel";
import { FileText } from "@/components/icons";
import { BROCHURES, BROCHURE_CATEGORIES } from "@/lib/brochures";

export const metadata: Metadata = {
  title: "Product Brochures",
  description:
    "Download official Guardian Life product brochures: life insurance, health, critical illness, personal accident, pension and investment plans in Trinidad & Tobago.",
};

export default function BrochuresPage() {
  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <span className="block h-1.5 w-24 rounded-full bg-swoosh" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Product brochures
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The official Guardian brochures for the plans I offer. Browse, open the
          PDF, and when something catches your eye, book a call and we will go
          through it together.
        </p>
      </header>

      <BrochureCarousel brochures={BROCHURES} />

      {/* Full list, grouped by category */}
      <section className="space-y-8">
        {BROCHURE_CATEGORIES.map((category) => {
          const items = BROCHURES.filter((b) => b.category === category);
          if (!items.length) return null;
          return (
            <div key={category}>
              <h2 className="text-xl font-semibold text-brand">{category}</h2>
              <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm">
                {items.map((b) => (
                  <li key={b.slug}>
                    <a
                      href={b.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 transition hover:bg-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-800 group-hover:text-brand">
                          {b.title}
                        </span>
                        <span className="block text-xs text-slate-500">PDF brochure</span>
                      </span>
                      <span className="text-sm font-medium text-brand">
                        Open{" "}
                        <span className="inline-block transition group-hover:translate-x-0.5">→</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <p className="max-w-2xl text-sm text-slate-500">
        Brochures are a general guide only. Benefits, terms and availability are
        set by the policy contract. Book a call at{" "}
        <a href="/book" className="font-semibold text-brand hover:underline">
          joansonbjames.com/book
        </a>{" "}
        and Joanson will confirm what fits you.
      </p>
    </div>
  );
}
