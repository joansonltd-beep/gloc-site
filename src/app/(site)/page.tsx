import Hero from "@/components/Hero";
import NeedsRouter from "@/components/NeedsRouter";
import ClusterCards from "@/components/ClusterCards";
import TestimonialBand from "@/components/TestimonialBand";
import AboutTeaser from "@/components/AboutTeaser";
import {
  getSiteSettings,
  getClusters,
  getTestimonials,
  getAbout,
} from "@/lib/siteData";

// M1 landing page, now sourcing content from Sanity (spec.md §6, §9, §11).
export default async function Home() {
  const [settings, clusters, testimonials, about] = await Promise.all([
    getSiteSettings(),
    getClusters(),
    getTestimonials(),
    getAbout(),
  ]);

  return (
    <div className="space-y-16 sm:space-y-20">
      <Hero settings={settings} />
      <NeedsRouter />
      <ClusterCards clusters={clusters} />
      <TestimonialBand testimonials={testimonials} />
      <AboutTeaser
        agentName={settings.agentName}
        teaser={about.teaser}
        headshotUrl={settings.headshotUrl}
      />
    </div>
  );
}
