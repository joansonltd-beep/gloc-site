import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";
import { getCluster, getLines } from "@/lib/siteData";
export const metadata: Metadata = {
  title: "Retirement Planning Jamaica",
  description: "Review pension, annuity and investment options in Jamaica with Bulwark. Understand costs, access and risk before deciding.",
  alternates: { canonical: "/grow" },
};
export default async function GrowPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("grow"),
    getLines("grow"),
  ]);
  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <PensionInflationProjector />
      <InvestmentGrowthProjector />
    </ClusterHub>
  );
}
