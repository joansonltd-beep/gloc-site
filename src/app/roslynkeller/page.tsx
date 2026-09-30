import type { Metadata } from "next";

const TRACKER_URL = "https://claude.ai/artifact/Xz7vwxJE9AnCJuw2ZXu841";

// Unlisted: not in the nav, sitemap or robots.txt, and noindexed. The tracker
// itself is a private claude.ai page, so this only points at it.
export const metadata: Metadata = {
  title: "Roslyn Keller",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function RoslynKellerPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200">
        <span className="block h-1.5 w-24 rounded-full bg-accent" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Private tool
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-brand">
          Roslyn Keller&rsquo;s activity tracker
        </h1>
        <p className="mt-3 text-slate-700">
          Log your daily prospecting and sales activity, and see each week where
          you are on pace and where you are falling short.
        </p>
        <a
          href={TRACKER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Open the tracker
        </a>
        <p className="mt-6 text-sm text-slate-500">
          The tracker opens on claude.ai. Sign in with the account it has been
          shared with. If it says you do not have access, contact the site
          owner to be added.
        </p>
      </div>
    </main>
  );
}
