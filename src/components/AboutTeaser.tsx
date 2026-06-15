import Link from "next/link";
import Image from "next/image";

// About teaser. Full story, credentials & HeyGen video live on /about (M5).
export default function AboutTeaser({
  agentName,
  teaser,
  headshotUrl,
}: {
  agentName: string;
  teaser: string;
  headshotUrl: string | null;
}) {
  return (
    <section className="grid items-center gap-6 rounded-2xl border border-slate-200 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-dark">
        {headshotUrl ? (
          <Image
            src={headshotUrl}
            alt={agentName}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl text-white/70">
            👤
          </span>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-brand">
          A local adviser who actually explains things
        </h2>
        <p className="mt-2 max-w-prose text-slate-600">
          {agentName} is {teaser}
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-sm font-semibold text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Read the full story →
        </Link>
      </div>
    </section>
  );
}
