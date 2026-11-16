import Link from "next/link";
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import { getCluster, getLines } from "@/lib/siteData";
export const metadata: Metadata = pageMetadata({
  title: "Retirement Planning Jamaica",
  description: "Review pension, annuity and investment options in Jamaica with Joanson. Understand costs, access and risk before deciding.",
  alternates: { canonical: "/grow" },
});
export default async function GrowPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("grow"),
    getLines("grow"),
  ]);
  return (
    <ClusterHub cluster={cluster} lines={lines}>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link className="button-text" href="/tools#retirement">Retirement savings calculator <span aria-hidden>→</span></Link>
        <Link className="button-text" href="/tools#investment">Savings and investment projector <span aria-hidden>→</span></Link>
      </div>
    </ClusterHub>
  );
}
