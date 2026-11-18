import Link from "next/link";
import ConsultationLink from "@/components/ConsultationLink";
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from "next";
import ClusterHub from "@/components/ClusterHub";
import { getCluster, getLines } from "@/lib/siteData";
export const metadata: Metadata = pageMetadata({
  title: "Life and Health Insurance Jamaica",
  description: "Compare life, health, critical illness and personal accident insurance with independent guidance from Joanson “Joey” Baptiste James in Jamaica.",
  alternates: { canonical: "/protect" },
});
export default async function ProtectPage() {
  const [cluster, lines] = await Promise.all([
    getCluster("protect"),
    getLines("protect"),
  ]);
  return (
    <ClusterHub cluster={cluster} lines={lines} linkLines>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link className="button-text" href="/tools#life-insurance">Life insurance needs calculator <span aria-hidden>→</span></Link>
        <Link className="button-text" href="/tools#critical-illness">Critical illness cost explorer <span aria-hidden>→</span></Link>
        <ConsultationLink />
      </div>
    </ClusterHub>
  );
}
