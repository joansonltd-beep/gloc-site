import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import QuickQuoteRequest from "@/components/tools/QuickQuoteRequest";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Motor, Home and Property Insurance Jamaica",
  description: "Compare motor, home and property insurance in Jamaica with Bulwark. Understand policy limits, exclusions and costs.",
  alternates: { canonical: "/assets" },
};

export default async function AssetsPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("assets"),
    getLines("assets"),
  ]);

  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <QuickQuoteRequest />
    </ClusterHub>
  );
}
