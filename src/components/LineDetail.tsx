import Link from "next/link";
import { SERVICE_FAQS } from "@/lib/serviceFaqs";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { notFound } from "next/navigation";
import { LINE_DETAILS, CLUSTERS, type ClusterKey } from "@/lib/content";
import { getLineDetail } from "@/lib/siteData";
import ProtectionPlanner from "@/components/tools/ProtectionPlanner";
import CriticalIllnessExplorer from "@/components/tools/CriticalIllnessExplorer";
import PensionInflationProjector from "@/components/tools/PensionInflationProjector";
import InvestmentGrowthProjector from "@/components/tools/InvestmentGrowthProjector";
import QuickQuoteRequest from "@/components/tools/QuickQuoteRequest";
import GroupBenefitsEnquiry from "@/components/tools/GroupBenefitsEnquiry";
import TermInsuranceForm from "@/components/tools/TermInsuranceForm";
import WhatsAppCTA from "@/components/tools/WhatsAppCTA";
import BrochureSection from "@/components/BrochureSection";
import { Check } from "@/components/icons";

// Detail page for a single product line: what it is, why it matters, and the
// relevant calculator. The text (title/tagline/what/why) is editable in Studio
// via the "Product page content" (lineDetail) document; the bundled content.ts
// values are the fallback. The calculator/tool stays mapped in code.
export default async function LineDetail({
  clusterKey,
  slug,
}: {
  clusterKey: ClusterKey;
  slug: string;
}) {
  const detail = LINE_DETAILS.find(
    (d) => d.clusterKey === clusterKey && d.slug === slug,
  );
  if (!detail) notFound();

  const cluster = CLUSTERS.find((c) => c.key === clusterKey)!;

  // CMS overrides, falling back to the bundled copy field by field.
  const override = await getLineDetail(clusterKey, slug);
  const title = override?.title || detail.title;
  const tagline = override?.tagline || detail.tagline;
  const what = override?.what?.length ? override.what : detail.what;
  const why = override?.why?.length ? override.why : detail.why;

  let calculator: React.ReactNode = null;
  switch (detail.calculator) {
    case "protection":
      calculator = <ProtectionPlanner />;
      break;
    case "critical-illness":
      calculator = <CriticalIllnessExplorer />;
      break;
    case "pension":
      calculator = <PensionInflationProjector />;
      break;
    case "investment":
      calculator = <InvestmentGrowthProjector />;
      break;
    case "quick-quote":
      calculator = <QuickQuoteRequest />;
      break;
    case "group":
      calculator = <GroupBenefitsEnquiry />;
      break;
  }

  const message = `Hi, I'd like to know more about ${title}.`;

  return (
    <div className="space-y-12">
      <nav className="text-sm text-slate-500">
        <Link href={`/${cluster.key}`} className="hover:text-brand">
          {cluster.title}
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <span className="text-slate-700">{title}</span>
      </nav>

      <header className="max-w-2xl">
        <span className="block h-1.5 w-24 rounded-full bg-swoosh" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          {title} in Jamaica
        </h1>
        <p className="mt-3 text-lg text-slate-600">{tagline}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-brand">What it is</h2>
          {what.map((p, i) => (
            <p key={i} className="leading-relaxed text-slate-700">
              {p}
            </p>
          ))}
        </section>

        <section className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-brand">Why it matters</h2>
          <ul className="mt-3 space-y-2">
            {why.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="max-w-3xl text-slate-600">Independent guidance from Bulwark Insurance Agency Ltd helps you compare options from multiple insurers and make an informed decision.</p>
      <BrochureSection pageKey={`${clusterKey}/${slug}`} />

      {calculator}

      {detail.slug === "life-insurance" ? <TermInsuranceForm /> : null}

      <section aria-labelledby="service-faqs"><h2 id="service-faqs" className="text-2xl font-semibold text-brand">Your questions about {title.toLowerCase()}</h2><div className="mt-4 space-y-3">{(SERVICE_FAQS[slug] ?? []).map(faq => <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-semibold text-brand">{faq.question}</summary><p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p></details>)}</div></section>
      <p className="text-sm leading-relaxed text-slate-500">{DEFAULT_SETTINGS.footerDisclaimer}</p>
      <section className="rounded-2xl bg-gradient-to-br from-brand-light via-brand to-brand-dark p-6 text-white sm:p-8">
        <h2 className="text-xl font-semibold">Not sure where to start? Book a no-pressure consultation.</h2>
        <p className="mt-1 text-white/80">
          Bring your questions about {title.toLowerCase()}. We can discuss your
          priorities and the next steps for your situation.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href="/book" className="button-gold">Book a consultation</Link>
          <WhatsAppCTA
            message={message}
            label="Chat on WhatsApp"
            lead={{ source: `line-${detail.slug}`, recommended: title }}
          />
        </div>
      </section>
    </div>
  );
}
