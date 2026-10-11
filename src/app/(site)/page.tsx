import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import NeedsRouter from "@/components/NeedsRouter";
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
      <Hero settings={settings} />
      <div className="home-principles">
        <p>Built around real life</p>
        <span>Family &amp; everyday commitments</span>
        <span>Plans for the years ahead</span>
        <span>Clear questions. Informed decisions.</span>
      </div>
      <ClusterCards clusters={clusters} />
      <section className="personal-section">
        <div>
          <p className="eyebrow">Meet Joanson</p>
          <h2>
            Good planning begins
            <br />
            with <em>listening.</em>
          </h2>
        </div>
        <div>
          <p>
            School fees, household bills, caring for parents, building a
            business. Your financial decisions sit alongside the things you do
            every day.
          </p>
          <p>
            I&apos;m {settings.agentName}. Let&apos;s talk about what matters to
            you and put your questions into perspective, one step at a time.
          </p>
          <Link href="/about" className="button-text">
            More about my approach <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
      <HowItWorks />
      <div className="discovery-section">
        <NeedsRouter />
      </div>
      <section className="home-invitation">
        <p className="eyebrow">Your next chapter</p>
        <h2>
          A little clarity can
          <br />
          help you move forward.
        </h2>
        <p>Bring your questions. We can start there.</p>
        <Link href="/book" className="button-gold">
          Find a time to talk <span aria-hidden>↗</span>
        </Link>
      </section>
    </div>
  );
}
