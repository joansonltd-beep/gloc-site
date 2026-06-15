import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";
import { getCluster, getLines, getCalculatorSettings } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Grow: Pension, Annuities & Investments",
  description:
    "Build wealth and beat inflation with pensions, annuities and investments. Try the projectors.",
};

export default async function GrowPage() {
  const [cluster, lines, calc] = await Promise.all([
    getCluster("grow"),
    getLines("grow"),
    getCalculatorSettings(),
  ]);

  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <PensionInflationProjector settings={calc} />
      <InvestmentGrowthProjector settings={calc} />
    </ClusterHub>
  );
}
