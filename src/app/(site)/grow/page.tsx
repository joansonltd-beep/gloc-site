import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";
import { getCluster, getLines } from "@/lib/siteData";
export const metadata: Metadata = {
  title: "Retirement & Savings in Jamaica",
  description:
    "Think through your retirement and savings goals. Explore illustrations in Jamaican dollars using your own assumptions.",
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
