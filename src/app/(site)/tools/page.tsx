import NavigationCards from "@/components/NavigationCards";
import NeedsRouter from "@/components/NeedsRouter";
import ConsultationLink from "@/components/ConsultationLink";
import { pageMetadata } from "@/lib/seo";
import LifeNeedsCalculator from "@/components/tools/LifeNeedsCalculator";
import CriticalIllnessExplorer from "@/components/tools/CriticalIllnessExplorer";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";
import GroupBenefitsEnquiry from "@/components/tools/GroupBenefitsEnquiry";
import TermInsuranceForm from "@/components/tools/TermInsuranceForm";
import EducationSavingsCalculator from "@/components/tools/EducationSavingsCalculator";

export const metadata = pageMetadata({
  title: "Insurance tools and calculators",
  description: "Explore life insurance, critical illness, education savings, pensions and group insurance with planning tools for Jamaica.",
  alternates: { canonical: "/tools" },
});

const calculators = new Set(["life-insurance", "critical-illness", "education", "retirement", "investment"]);

const tools = [
  { id: "life-insurance", label: "Life insurance needs", Tool: LifeNeedsCalculator },
  { id: "critical-illness", label: "Critical illness costs", Tool: CriticalIllnessExplorer },
  { id: "education", label: "Education savings", Tool: EducationSavingsCalculator },
  { id: "retirement", label: "Retirement savings", Tool: PensionInflationProjector },
  { id: "investment", label: "Savings and investment growth", Tool: InvestmentGrowthProjector },
  { id: "group-benefits", label: "Group benefits enquiry", Tool: GroupBenefitsEnquiry },
  { id: "term-insurance", label: "Term insurance enquiry", Tool: TermInsuranceForm },
];

export default function ToolsPage() {
  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-semibold text-brand sm:text-4xl">Tools &amp; resources</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Estimate insurance needs, explore savings scenarios or prepare an insurance enquiry.</p>
      </header>
      <NavigationCards menu="tools" />
      <NeedsRouter />
      {tools.map(({ id, label, Tool }) => (
        <section id={id} key={id} aria-labelledby={`${id}-title`} className="space-y-3">
          <h2 id={`${id}-title`} className="text-2xl font-semibold text-brand">{label}</h2>
          <Tool />
          {calculators.has(id) && <ConsultationLink withNote />}
        </section>
      ))}
    </div>
  );
}
