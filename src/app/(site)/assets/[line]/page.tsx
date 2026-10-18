import { pageMetadata } from '@/lib/seo';
import type { Metadata } from "next";
import LineDetail from "@/components/LineDetail";
import { LINE_DETAILS } from "@/lib/content";

const CLUSTER = "assets" as const;

export function generateStaticParams() {
  return LINE_DETAILS.filter((d) => d.clusterKey === CLUSTER).map((d) => ({
    line: d.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ line: string }>;
}): Promise<Metadata> {
  const { line } = await params;
  const d = LINE_DETAILS.find((x) => x.clusterKey === CLUSTER && x.slug === line);
  return d
    ? pageMetadata({
        title: `${d.title} Jamaica`,
        description: `Compare ${d.title.toLowerCase()} options in Jamaica with Bulwark Insurance Agency Ltd. Understand benefits, costs and terms. Book a consultation.`,
        alternates: { canonical: `/${CLUSTER}/${d.slug}` },
      })
    : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ line: string }>;
}) {
  const { line } = await params;
  return <LineDetail clusterKey={CLUSTER} slug={line} />;
}
