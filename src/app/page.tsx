import Link from "next/link";

// M0 placeholder landing page. The agent hero + Needs-Discovery Router
// arrive in M1 (see spec.md §6).
export default function Home() {
  const clusters = [
    { href: "/protect", title: "Protect", blurb: "Life · Health · Critical Illness" },
    { href: "/grow", title: "Grow", blurb: "Pension/Annuities · Investments" },
    { href: "/assets", title: "Assets", blurb: "Motor · Home · Property" },
    { href: "/business", title: "Business", blurb: "Group / employee benefits" },
  ];

  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Placeholder — M0 scaffold
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Guardian Group Agent Website
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Project scaffold only. The agent-led hero and Needs-Discovery Router
          are built in M1. For now, every page below is a clickable placeholder.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {clusters.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-slate-200 p-5 transition hover:border-slate-400"
          >
            <h2 className="font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.blurb}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
