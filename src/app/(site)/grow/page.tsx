import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Grow: Pension, Annuities & Investments",
  description:
    "Build wealth and beat inflation with pensions, annuities and investments. Try the projectors.",
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
