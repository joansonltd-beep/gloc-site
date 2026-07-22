// Simple 5-step process so visitors know what to expect.
export default function HowItWorks() {
  const steps = [
    { n: 1, title: "Book a meeting", body: "Pick a time, or send a quick message. No cost, no obligation." },
    { n: 2, title: "Discuss your goals", body: "We talk through your situation, what matters to you, and your budget." },
    { n: 3, title: "Review your options", body: "I lay out the cover that fits, in plain language, with the numbers." },
    { n: 4, title: "Put a plan in place", body: "When you're ready, we set up the cover you've chosen." },
    { n: 5, title: "Ongoing support and reviews", body: "I stay your point of contact for changes, questions and claims." },
  ];

  return (
    <section>
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-slate-600">Five simple steps, at your pace.</p>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s) => (
          <li
            key={s.n}
            className="rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {s.n}
            </span>
            <h3 className="mt-3 font-semibold text-brand">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
