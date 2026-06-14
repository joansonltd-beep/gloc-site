import Link from "next/link";
import { AGENT } from "@/config/site";

// About teaser — full story, credentials & HeyGen video live on /about (M5).
export default function AboutTeaser() {
  return (
    <section className="grid items-center gap-6 rounded-2xl border border-slate-200 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-3xl text-white/70">
        👤
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-brand">
          A local adviser who actually explains things
        </h2>
        <p className="mt-2 max-w-prose text-slate-600">
          {AGENT.name} is an independent Guardian Group adviser based in
          Trinidad &amp; Tobago, helping young professionals and families make
          confident calls about their money and their cover — in plain language.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
        >
          Read the full story →
        </Link>
      </div>
    </section>
  );
}
