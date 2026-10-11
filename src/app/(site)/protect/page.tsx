import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import LifeNeedsCalculator from "@/components/tools/LifeNeedsCalculator";
import CriticalIllnessExplorer from "@/components/tools/CriticalIllnessExplorer";
import { getCluster, getLines } from "@/lib/siteData";
export const metadata: Metadata = {
  title: "Family & Health Planning in Jamaica",
  description:
    "Explore life, health and critical illness questions, with a family cover planning tool in Jamaican dollars.",
  alternates: { canonical: "/protect" },
};
export default async function ProtectPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("protect"),
    getLines("protect"),
  ]);
  return (
    <ClusterHub cluster={cluster} lines={lines} linkLines>
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-brand">
          What would your family need?
        </h2>
        <p className="max-w-2xl text-slate-600">
          Start with household expenses, debts, education and the people who
          depend on you. This tool uses your own figures to help prepare for a
          conversation.
        </p>
        <LifeNeedsCalculator />
      </section>
      <CriticalIllnessExplorer />
    </ClusterHub>
  );
}
