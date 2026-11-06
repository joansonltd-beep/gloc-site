import type { Metadata } from "next";
import Link from "next/link";
import documents from "@/lib/product-documents.json";
import JnLifePrograms from "@/components/JnLifePrograms";
export const metadata: Metadata = {
  title: "Insurance Product Documents",
  description: "Guardian and Sagicor product documents and official JN Life programme information for Jamaica.",
};
export default function BrochuresPage() {
  return <div className="max-w-5xl space-y-8">
    <div className="max-w-2xl space-y-4">
      <h1 className="text-4xl font-semibold text-brand">Explore your insurance options</h1>
      <p className="leading-relaxed text-slate-600">Browse Guardian and Sagicor documents and official JN Life plan information, then let’s talk about what fits your needs.</p>
      <p className="rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">These are reference documents. Editions, benefits and availability may have changed. Confirm current terms before applying. An application form is not a brochure or a quotation. Please do not send completed forms or medical details through this website.</p>
      <Link href="/book" className="button-primary">Help me understand my options <span aria-hidden>↗</span></Link>
    </div>
    <JnLifePrograms />
    {['Guardian', 'Sagicor'].map(carrier => <section key={carrier} className="space-y-4">
      <h2 className="text-2xl font-semibold text-brand">{carrier}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{documents.filter(d => d.carrier === carrier).map(d => <article key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h3 className="text-lg font-semibold text-slate-800">{d.title}</h3>
        <p className="text-sm text-slate-600">{d.kind} · PDF · {d.pages} pages</p>
        <p className="text-xs text-slate-500">Source copy saved {d.retrieved}. Current edition not confirmed.</p>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-brand"><a href={d.file} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open PDF</a><a href={d.file} download className="underline underline-offset-4">Download</a><a href={d.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Carrier source</a></div>
      </article>)}</div>
    </section>)}
    <section className="rounded-2xl bg-slate-50 p-6 space-y-3"><h2 className="text-2xl font-semibold text-brand">Looking for group benefits?</h2><p className="text-slate-600">Group life and health options depend on your organisation and employee needs. Ask for current plan information and a tailored quotation.</p><Link href="/book" className="font-semibold text-brand underline">Discuss group coverage</Link></section>
  </div>;
}
