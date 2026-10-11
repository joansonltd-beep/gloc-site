import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import GroupBenefitsEnquiry from "@/components/tools/GroupBenefitsEnquiry";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Group Coverage (Life/Health/Pensions)",
  description:
    "Discuss group life, health and pension coverage for your employees in Jamaica.",
  alternates: { canonical: "/business" },
};

export default async function BusinessPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("business"),
    getLines("business"),
  ]);

  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <GroupBenefitsEnquiry />
    </ClusterHub>
  );
}
