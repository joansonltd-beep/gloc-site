import { pageMetadata } from '@/lib/seo';
import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import GroupBenefitsEnquiry from "@/components/tools/GroupBenefitsEnquiry";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = pageMetadata({
  title: "Group Coverage in Jamaica (Life/Health/Pensions)",
  description: "Compare group life, health and pension options for your employees in Jamaica with independent guidance from Bulwark Insurance Agency Ltd.",
  alternates: { canonical: "/business" },
});

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
