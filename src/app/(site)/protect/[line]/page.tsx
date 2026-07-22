import type { Metadata } from "next";
import LineDetail from "@/components/LineDetail";
import { LINE_DETAILS } from "@/lib/content";

const CLUSTER = "protect" as const;

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
    ? {
        title: d.title,
        description: d.tagline,
        alternates: { canonical: `/${CLUSTER}/${d.slug}` },
      }
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
