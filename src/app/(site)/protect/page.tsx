import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import ProtectionPlanner from "@/components/tools/ProtectionPlanner";
import LifeNeedsCalculator from "@/components/tools/LifeNeedsCalculator";
import CriticalIllnessExplorer from "@/components/tools/CriticalIllnessExplorer";
import { getCluster, getLines, getCostFigures, getIllnessCosts } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "How Much Life Insurance Do I Need? Free Calculator (Trinidad & Tobago)",
  description:
    "Work out how much life insurance you need with a free calculator built for Trinidad & Tobago. See suggested life and critical illness cover based on your income and age.",
  alternates: { canonical: "/protect" },
  openGraph: {
    title: "How Much Life Insurance Do I Need? Free Calculator",
    description:
      "Estimate the life and critical illness cover that would keep your family steady, based on your income and age.",
    url: "/protect",
    type: "website",
  },
};

// Q&A shown on the page and mirrored into FAQPage structured data, so the exact
// question "how much life insurance do I need" is eligible for rich results.
const FAQ = [
  {
    q: "How much life insurance do I need?",
    a: "A common approach is to base your cover on a multiple of your yearly income, with the multiple set by your age. Younger people can be covered for a higher multiple because there are more working years to protect, so cover runs from about 30 times income under age 30 down to a lower multiple as you get older. Use the calculator above to get a suggested amount based on your income and age.",
  },
  {
    q: "How is the amount worked out?",
    a: "The calculator multiplies your yearly income by a factor based on your age for life cover, and a separate factor for critical illness cover. It is a quick guide to the level of protection to aim for. Your final amount depends on your goals, debts and budget, which we work out together.",
  },
  {
    q: "Is a life insurance payout taxed in Trinidad and Tobago?",
    a: "A life insurance payout to your beneficiaries is generally tax-free in Trinidad and Tobago, so the full sum goes to the people you choose.",
  },
];

export default async function ProtectPage() {
  const [cluster, lines, costFigures, illnessCosts] = await Promise.all([
    getCluster("protect"),
    getLines("protect"),
    getCostFigures(),
    getIllnessCosts(),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <ClusterHub cluster={cluster} lines={lines} linkLines linesLast>
      {/* Existing combined planner stays, and leads the page. */}
      <ProtectionPlanner costFigures={costFigures} />

      {/* Dedicated "how much do I need" calculator + on-page SEO. */}
      <section aria-labelledby="how-much" className="space-y-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="max-w-2xl">
          <h2
            id="how-much"
            className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
          >
            How much life insurance do I need?
          </h2>
          <p className="mt-2 text-slate-600">
            The right amount of life cover replaces your income and clears what you owe,
            so your family can stay in their home and keep their plans. Enter your
            numbers below for an estimate built around your life in Trinidad and Tobago.
          </p>
        </div>

        <LifeNeedsCalculator />

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm sm:p-8">
          <h3 className="text-lg font-semibold text-brand">Common questions</h3>
          <dl className="mt-4 space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
                <dt className="font-semibold text-slate-800">{item.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CriticalIllnessExplorer illnessCosts={illnessCosts} />
    </ClusterHub>
  );
}
