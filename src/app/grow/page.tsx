import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";

export const metadata: Metadata = {
  title: "Grow: Pension, Annuities & Investments",
  description:
    "Build wealth and beat inflation with pensions, annuities and investments. Try the projectors.",
};

export default function GrowPage() {
  return (
    <ClusterHub cluster="grow">
      <PensionInflationProjector />
      <InvestmentGrowthProjector />
    </ClusterHub>
  );
}
