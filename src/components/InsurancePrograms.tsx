import JnLifePrograms from "@/components/JnLifePrograms";
import library from "@/lib/dashboard/product-library.json";
import documents from "@/lib/product-documents.json";

const pageProducts: Record<string, readonly string[]> = {
  "protect/life-insurance": [
    "guardian-life-guardian-lifesaver",
    "guardian-life-guardian-assure-plan",
    "guardian-life-guardian-instant-coverage",
    "guardian-life-guardian-flexi-term-special",
    "sagicor-life-maximum-protector",
    "sagicor-life-super-term",
    "sagicor-life-ultra-life",
  ],
  "protect/critical-illness": [
    "guardian-life-guardian-care-plus",
    "sagicor-life-critical-illness-protector",
    "sagicor-life-ultra-life",
  ],
  "protect/health": [
    "guardian-life-guardian-individual-health-essential",
    "guardian-life-guardian-individual-health-edge",
    "guardian-life-guardian-individual-health-elite",
    "sagicor-life-executive-health",
    "sagicor-life-executive-health-plus",
    "sagicor-life-supreme-health",
  ],
  "protect/personal-accident": ["sagicor-life-personal-accident"],
  "grow/pension-annuities": [
    "guardian-life-guardian-retirement-scheme",
    "guardian-life-annuities",
    "sagicor-life-sagicor-lifestyle",
  ],
  "grow/investments-mutual-funds": [
    "guardian-life-guardian-investor",
    "guardian-life-guardian-achiever",
    "sagicor-life-solid-investor",
    "sagicor-life-guaranteed-investor",
  ],
  "business/group-employee-benefits": ["sagicor-life-group-life"],
};

export default function InsurancePrograms({ pageKey }: { pageKey: string }) {
  const ids = pageProducts[pageKey] ?? [];
  const products = library.products.filter(product => ids.includes(product.id));

  return (
    <div className="space-y-8">
      <JnLifePrograms pageKey={pageKey} />
      {["Guardian Life", "Sagicor Life"].map(carrier => {
        const items = products.filter(product => product.carrier === carrier);
        if (!items.length) return null;
        return (
          <section key={carrier} aria-label={carrier + " product references"} className="space-y-4">
            <h2 className="text-2xl font-semibold text-brand">{carrier}</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Product references from the insurer. Ask Joanson to confirm current availability,
              eligibility, costs and policy terms.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map(product => {
                const source = library.sources.find(item => product.sources.includes(item.id));
                const downloads = documents.filter(item => product.documents.includes(item.id));
                return (
                  <article key={product.id} className="space-y-3 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
                    {product.status === "Restricted scheme" && (
                      <p className="text-sm text-slate-600">Group or scheme eligibility applies.</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand">
                      {source && <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Official reference</a>}
                      {downloads.map(document => (
                        <a key={document.id} href={document.file} target="_blank" rel="noopener noreferrer"
                          className="underline underline-offset-4">{document.title}</a>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
