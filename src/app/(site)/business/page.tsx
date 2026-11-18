import Link from "next/link";
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import { getCluster, getLines } from "@/lib/siteData";

export const metadata: Metadata = pageMetadata({
  title: "Group Insurance in Jamaica (Life/Health/Pensions)",
  description: "Compare group life, health and pension options for your employees in Jamaica with independent guidance from Joanson “Joey” Baptiste James.",
  alternates: { canonical: "/business" },
});

export default async function BusinessPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("business"),
    getLines("business"),
  ]);

  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link className="button-text" href="/tools#group-benefits">Group benefits enquiry <span aria-hidden>→</span></Link>
      </div>
    </ClusterHub>
  );
}
