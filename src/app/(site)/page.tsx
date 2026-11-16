import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import ClusterCards from "@/components/ClusterCards";
import HowItWorks from "@/components/HowItWorks";
import { getSiteSettings, getClusters } from "@/lib/siteData";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const [settings, clusters] = await Promise.all([
    getSiteSettings(),
    getClusters(),
  ]);
  return (
    <div className="homepage">
      <Hero headline={settings.heroHeadline} description="Insurance guidance for individuals, families and businesses across Jamaica. Explore your options and find coverage that fits your needs." />
      <div className="home-content">
        <ClusterCards clusters={clusters} />
        <section className="home-resources" id="resources" aria-labelledby="resources-title">
          <h2 id="resources-title">Tools &amp; resources</h2>
          <nav className="home-quick-links" aria-label="Tools and resources">
            <Link href="/tools">Browse calculators and planning tools <span aria-hidden>→</span></Link>
            <Link href="/tools#router">Find a starting point <span aria-hidden>→</span></Link>
            <Link href="/brochures">Browse product documents <span aria-hidden>→</span></Link>
          </nav>
        </section>
        <section className="home-invitation">
          <h2>Talk through your insurance options</h2>
          <Link href="/book" className="button-gold">
            Book a consultation <span aria-hidden>→</span>
          </Link>
        </section>
        <section className="personal-section">
          <div>
            <h2>Meet your insurance advisor</h2>
          </div>
          <div>
            <p>
              School fees, household bills, caring for parents, building a
              business. Your financial decisions sit alongside the things you do
              every day.
            </p>
            <p>
              {settings.agentName} is an insurance advisor serving Jamaica.
              Joanson helps you compare options from multiple insurers and explains
              how each option fits your needs.
            </p>
            <Link href="/about" className="button-text">
              More about Joanson <span aria-hidden>↗</span>
            </Link>
          </div>
        </section>
        <HowItWorks />
      </div>
    </div>
  );
}
