import Link from "next/link";
import { LineIcon } from "@/components/icons";
import type { ClusterData } from "@/lib/siteData";
const icons: Record<string, string> = {
  protect: "life-insurance",
  grow: "pension-annuities",
  business: "group-employee-benefits",
};
export default function ClusterCards({
  clusters,
}: {
  clusters: ClusterData[];
}) {
  return (
    <section
      id="explore"
      className="home-section scroll-mt-28"
      aria-labelledby="explore-title"
    >
      <div className="section-heading">
        <div>
          <h2 id="explore-title">What are you planning for?</h2>
        </div>
      </div>
      <div className="planning-grid">
        {clusters.map(c => (
          <Link key={c.key} href={`/${c.key}`} className="planning-card">
            <div className="planning-card-top">
              <LineIcon
                slug={icons[c.key]}
                className="aspect-[4/3] h-auto w-full"
              />
            </div>
            <h3>{c.title}</h3>
            <p>{c.intent}</p>
            <span className="planning-card-lines">{c.lines}</span>
            <span className="mt-3 block text-sm font-semibold text-brand">{c.key === "protect" ? "Get life cover guidance" : c.key === "grow" ? "Review my retirement options" : "Protect my business"}</span>
            <span className="planning-card-arrow" aria-hidden>
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
