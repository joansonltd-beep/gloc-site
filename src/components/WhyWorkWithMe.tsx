// Practical, specific client benefits. Plain language, no marketing claims.
export default function WhyWorkWithMe() {
  const reasons = [
    {
      title: "Plain language",
      body: "I explain what each option does and what it costs, so you know exactly what you are buying.",
    },
    {
      title: "Built around your budget",
      body: "We start from what you can comfortably afford and work out cover that fits.",
    },
    {
      title: "One point of contact",
      body: "The same person helps with your questions, changes to your policy, and claims when they come up.",
    },
    {
      title: "No pressure",
      body: "You get the information you need and decide in your own time. No hard sell.",
    },
  ];

  return (
    <section>
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          Why work with me
        </h2>
        <p className="mt-2 text-slate-600">
          Straightforward help choosing protection and savings cover that suits
          your situation.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm"
          >
            <h3 className="font-semibold text-brand">{r.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
