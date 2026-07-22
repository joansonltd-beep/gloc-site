import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import GroupBenefitsEnquiry from "@/components/tools/GroupBenefitsEnquiry";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Business: Group & Employee Benefits",
  description:
    "Cover your team with group health, life and pension benefits. Send an enquiry.",
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
