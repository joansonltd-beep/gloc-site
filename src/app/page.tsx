import Hero from "@/components/Hero";
import NeedsRouter from "@/components/NeedsRouter";
import ClusterCards from "@/components/ClusterCards";
import TestimonialBand from "@/components/TestimonialBand";
import AboutTeaser from "@/components/AboutTeaser";

// M1 landing page (spec.md §6, §9). Dummy content throughout.
export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <Hero />
      <NeedsRouter />
      <ClusterCards />
      <TestimonialBand />
      <AboutTeaser />
    </div>
  );
}
