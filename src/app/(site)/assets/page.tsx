import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import QuickQuoteRequest from "@/components/tools/QuickQuoteRequest";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Assets: Motor, Home & Property",
  description:
    "Insure what you own: motor, home and property cover. Send your details and I'll follow up.",
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
