// Credibility / experience band. Facts from the agent's background, framed with
// compliant titles only (Insurance Agent / Sales Representative).
export default function Credibility({ agentName }: { agentName: string }) {
  const points = [
    {
      stat: "13+ years",
      label: "In financial services across the Caribbean, spanning banking, treasury, insurance and customer service.",
    },
    {
      stat: "Guardian Group",
      label: "Sales Representative, helping clients match their needs to suitable insurance and savings cover.",
    },
    {
      stat: "RBC · First Citizens · ACB",
      label: "Experience built at established regional financial institutions.",
    },
    {
      stat: "Confidential & compliant",
      label: "Client service delivered in line with industry regulations and good practice.",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm sm:p-10">
      <div className="max-w-2xl">
        <span className="block h-1.5 w-24 rounded-full bg-swoosh" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          Experience you can rely on
        </h2>
        <p className="mt-3 text-slate-600">
          I&apos;m {agentName}, an Insurance Agent and Sales Representative with
          Guardian Group. I bring more than 13 years of experience across
          banking, treasury, insurance and customer service in the Caribbean, so
          you get clear guidance from someone who knows the field.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p) => (
          <div key={p.stat} className="rounded-xl border border-slate-200 p-5">
            <p className="text-lg font-semibold text-brand">{p.stat}</p>
            <p className="mt-1 text-sm text-slate-600">{p.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
