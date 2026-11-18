import Link from "next/link";
import { notFound } from "next/navigation";
import { LINE_DETAILS, CLUSTERS, type ClusterKey } from "@/lib/content";
import guides from "@/lib/insurance-guides.json";
import { SERVICE_FAQS } from "@/lib/serviceFaqs";
import InsurancePrograms from "@/components/InsurancePrograms";
import ConsultationLink from "@/components/ConsultationLink";
export default function LineDetail({clusterKey,slug}:{clusterKey:ClusterKey;slug:string}) {
 const detail=LINE_DETAILS.find(d=>d.clusterKey===clusterKey && d.slug===slug);
 if(!detail)notFound();
 const guide=guides[slug as keyof typeof guides];
 const cluster=CLUSTERS.find(c=>c.key===clusterKey)!;
 const tools:Record<string,[string,string]>={"life-insurance":["life-insurance","Life insurance needs calculator"],"critical-illness":["critical-illness","Critical illness cost explorer"],"pension-annuities":["retirement","Retirement savings calculator"],"investments-mutual-funds":["investment","Savings and investment projector"],"group-employee-benefits":["group-benefits","Group benefits enquiry"]};
 const tool=tools[slug];
 return <div className="space-y-10">
  <nav aria-label="Page location" className="text-sm text-slate-600"><Link href={`/${cluster.key}`} className="underline">{cluster.title}</Link><span aria-hidden> / </span>{detail.title}</nav>
  <header className="max-w-3xl"><h1 className="text-4xl font-semibold text-brand">{detail.title} in Jamaica</h1><p className="mt-4 text-lg leading-relaxed text-slate-600">{guide.intro}</p></header>
  <article className="insurance-guide">{guide.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</section>)}</article>
  <InsurancePrograms pageKey={`${clusterKey}/${slug}`} />
  <section className="insurance-guide"><h2>Before choosing a plan</h2><ul className="list-disc space-y-3 pl-5">{guide.checks.map(point=><li key={point}>{point}</li>)}</ul></section>
  <div className="flex flex-wrap gap-x-8 gap-y-4">
  {tool&&<Link className="button-text" href={`/tools#${tool[0]}`}>{tool[1]} <span aria-hidden>→</span></Link>}
  {tool&&slug!=='group-employee-benefits'&&<ConsultationLink />}
  {slug==='life-insurance'&&<Link className="button-text" href="/tools#term-insurance">Term insurance enquiry <span aria-hidden>→</span></Link>}
  </div>
  <section className="max-w-3xl"><h2 className="text-2xl font-semibold text-brand">Your questions</h2>{(SERVICE_FAQS[slug]||[]).map(faq=><details key={faq.question} className="border-b border-slate-200 py-4"><summary className="cursor-pointer font-semibold text-brand">{faq.question}</summary><p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p>{faq.links&&<p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">{faq.links.map(l=><Link key={l.href} className="button-text" href={l.href}>{l.label} <span aria-hidden>→</span></Link>)}</p>}</details>)}</section>
  <details className="max-w-3xl text-sm text-slate-600"><summary className="cursor-pointer font-semibold">Sources and further reading</summary><ul className="mt-3 space-y-2">{guide.sources.map(([label,url])=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="underline">{label}</a></li>)}</ul><p className="mt-3 leading-relaxed">These explanations describe types of insurance. The insurer’s current policy documents set the actual benefits, exclusions and claim requirements.</p></details>
  <section className="bg-brand-dark p-6 text-white sm:p-8"><h2 className="text-2xl font-semibold">Talk through your options</h2><p className="mt-3 max-w-2xl leading-relaxed">Bring your questions about {detail.title.toLowerCase()}. Joanson can explain the differences and help you work through what to check before choosing insurance.</p><Link href="/book" className="button-gold mt-5">Book a consultation</Link></section>
 </div>;
}
