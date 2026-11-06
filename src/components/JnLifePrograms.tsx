const programs = [
  { page: "protect/life-insurance", name: "JN Life VEST", summary: "Term life insurance with an investment option.", path: "life-insurance/jn-life-vest" },
  { page: "protect/life-insurance", name: "JN Life COMFORT", summary: "Whole life insurance designed to help with final expenses.", path: "life-insurance/jn-life-comfort" },
  { page: "protect/life-insurance", name: "JN Life Family COMFORT", summary: "Family indemnity cover designed to help with funeral expenses for eligible family members.", path: "life-insurance/family-indemnity-plan" },
  { page: "protect/critical-illness", name: "JN Life AIDE", summary: "Individual cover that pays a benefit for a qualifying diagnosis of a covered critical illness.", path: "life-insurance/jn-life-aide" },
  { page: "protect/critical-illness", name: "JN Life Family AIDE", summary: "Critical illness cover for the main insured and eligible family members.", path: "life-insurance/jn-life-family-aide" },
  { page: "business/group-employee-benefits", name: "Employee Benefit Group Life Insurance", summary: "Group life cover that employers can arrange for eligible employees.", path: "group-life/employee-benefit-group-life-insurance" },
  { page: "grow/pension-annuities", name: "JN Individual Retirement Scheme", summary: "An individual pension scheme for building retirement savings.", path: "pension/jn-individual-retirement-scheme" },
];

export default function JnLifePrograms({ pageKey }: { pageKey?: string }) {
  const items = pageKey ? programs.filter((program) => program.page === pageKey) : programs;
  if (!items.length) return null;

  return (
    <section aria-labelledby="jn-life-programs" className="space-y-4">
      <h2 id="jn-life-programs" className="text-2xl font-semibold text-brand">JN Life programmes</h2>
      <p className="text-slate-600">Check the insurer’s current terms, eligibility and exclusions before applying.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ name, summary, path }) => (
          <article key={path} className="space-y-2 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
            <a href={`https://www.jnlifeinsurance.com/${path}/`} className="inline-block text-sm font-semibold text-brand underline underline-offset-4" aria-label={`Read about ${name} on JN Life`}>Read the official plan details</a>
          </article>
        ))}
      </div>
    </section>
  );
}
