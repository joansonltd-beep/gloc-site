import Link from "next/link";
import { SERVICE_FAQS } from "@/lib/serviceFaqs";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { notFound } from "next/navigation";
import { LINE_DETAILS, CLUSTERS, type ClusterKey } from "@/lib/content";
import { getLineDetail } from "@/lib/siteData";
import WhatsAppCTA from "@/components/tools/WhatsAppCTA";
import BrochureSection from "@/components/BrochureSection";
import InsurancePrograms from "@/components/InsurancePrograms";
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

  const toolAnchors = {
    protection: ["life-insurance", "Life insurance needs calculator"],
    "critical-illness": ["critical-illness", "Critical illness cost explorer"],
    pension: ["retirement", "Retirement savings calculator"],
    investment: ["investment", "Savings and investment projector"],
    group: ["group-benefits", "Group benefits enquiry"],
  };
  const tool = detail.calculator ? toolAnchors[detail.calculator] : undefined;

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
        <h1 className="mt-4 text-3xl font-semibold text-brand sm:text-4xl">
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

        <section className="bg-white p-6">
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

      <p className="max-w-3xl text-slate-600">Independent guidance from Joanson “Joey” Baptiste James helps you compare options from multiple insurers and make an informed decision.</p>
      <BrochureSection pageKey={`${clusterKey}/${slug}`} />
      <InsurancePrograms pageKey={`${clusterKey}/${slug}`} />

      {(tool || detail.slug === "life-insurance") && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {tool && <Link className="button-text" href={`/tools#${tool[0]}`}>{tool[1]} <span aria-hidden>→</span></Link>}
          {detail.slug === "life-insurance" && <Link className="button-text" href="/tools#term-insurance">Term insurance enquiry <span aria-hidden>→</span></Link>}
        </div>
      )}

      <section aria-labelledby="service-faqs"><h2 id="service-faqs" className="text-2xl font-semibold text-brand">Your questions about {title.toLowerCase()}</h2><div className="mt-4 border-t border-slate-200">{(SERVICE_FAQS[slug] ?? []).map(faq => <details key={faq.question} className="border-b border-slate-200 py-4"><summary className="cursor-pointer font-semibold text-brand">{faq.question}</summary><p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p></details>)}</div></section>
      <p className="text-sm leading-relaxed text-slate-500">{DEFAULT_SETTINGS.footerDisclaimer}</p>
      <section className="bg-brand-dark p-6 text-white sm:p-8">
        <h2 className="text-xl font-semibold">Not sure where to start? Book a no-pressure consultation</h2>
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
