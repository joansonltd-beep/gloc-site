import type { Metadata } from "next";
import Hero from "@/components/Hero";
import NeedsRouter from "@/components/NeedsRouter";
import ClusterCards from "@/components/ClusterCards";
import WhyWorkWithMe from "@/components/WhyWorkWithMe";
import HowItWorks from "@/components/HowItWorks";
import Credibility from "@/components/Credibility";
import AboutTeaser from "@/components/AboutTeaser";
import { getSiteSettings, getClusters, getAbout } from "@/lib/siteData";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [settings, clusters, about] = await Promise.all([
    getSiteSettings(),
    getClusters(),
    getAbout(),
  ]);

  return (
    <div className="space-y-16 sm:space-y-20">
      <Hero settings={settings} />
      <NeedsRouter />
      <ClusterCards clusters={clusters} />
      <WhyWorkWithMe />
      <HowItWorks />
      <Credibility agentName={settings.agentName} />
      <AboutTeaser
        agentName={settings.agentName}
        teaser={about.teaser}
        headshotUrl={settings.headshotUrl}
      />
    </div>
  );
}
