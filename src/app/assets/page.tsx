import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import QuickQuoteRequest from "@/components/tools/QuickQuoteRequest";

export const metadata: Metadata = {
  title: "Assets: Motor, Home & Property",
  description:
    "Insure what you own: motor, home and property cover. Request a quick quote.",
};

export default function AssetsPage() {
  return (
    <ClusterHub cluster="assets">
      <QuickQuoteRequest />
    </ClusterHub>
  );
}
