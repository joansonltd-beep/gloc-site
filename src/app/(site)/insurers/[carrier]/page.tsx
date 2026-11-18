import Link from "next/link";
import { notFound } from "next/navigation";
import catalogue from "@/lib/public-insurers.json";
import { pageMetadata } from "@/lib/seo";
const topics=[
 ["life-insurance","Life insurance","Plans for providing a benefit when the insured person dies, with other benefits depending on the product."],
 ["critical-illness","Critical illness","Plans that provide benefits for qualifying covered illnesses. Definitions, waiting periods and claim conditions differ."],
 ["health","Health insurance","Individual, employer or eligible group arrangements for covered medical expenses. Check the actual benefit schedule."],
 ["personal-accident","Personal accident","Insurance for specified accidental injuries or accidental death, according to the policy’s benefit schedule."],
 ["pension-annuities","Pensions and annuities","Retirement arrangements and income options. Membership, contributions and access depend on the scheme or contract."],
 ["investments-mutual-funds","Investment-linked products","Insurance products with an investment or savings element. They are not the same as stand-alone mutual funds."],
 ["group-employee-benefits","Group and scheme benefits","Arrangements for eligible employers, associations or members. Joining a group does not automatically provide every benefit."],
];
export function generateStaticParams(){return catalogue.carriers.map(c=>({carrier:c.slug}))}
export async function generateMetadata({params}:{params:Promise<{carrier:string}>}){const {carrier}=await params;const c=catalogue.carriers.find(c=>c.slug===carrier);return c?pageMetadata({title:`${c.name} products and brochures`,description:c.intro,alternates:{canonical:`/insurers/${c.slug}`}}):{}}
export default async function CarrierPage({params}:{params:Promise<{carrier:string}>}){
 const {carrier}=await params;const c=catalogue.carriers.find(c=>c.slug===carrier);if(!c)notFound();
 const products=catalogue.products.filter(p=>p.carrier===c.name);
 return <div className="space-y-8"><Link href="/insurers" className="text-sm underline">All insurers</Link><header className="max-w-3xl"><h1 className="text-4xl font-semibold text-brand">{c.name} products</h1><p className="mt-4 leading-relaxed text-slate-600">{c.intro} Browse the plans and documents below, then bring your questions to Joanson.</p><p className="mt-4 text-sm leading-relaxed text-slate-600">Check current availability and policy terms before applying. Some plans require membership of an eligible group. A plan with several benefits may appear in more than one section.</p></header>
 <nav aria-label="Product categories" className="flex flex-wrap gap-x-6 gap-y-3 text-brand">{topics.filter(([key])=>products.some(p=>p.topics.includes(key))).map(([key,title])=><a href={`#${key}`} key={key} className="underline">{title}</a>)}</nav>
 <div className="insurer-products">{topics.map(([key,title,description])=>{const items=products.filter(p=>p.topics.includes(key));return !items.length?null:<section id={key} key={key}><h2>{title}</h2><p className="max-w-3xl leading-relaxed text-slate-600">{description}</p>{items.map(p=><article className="insurer-product" key={p.id}><h3>{p.name}</h3>{p.restricted&&<p>For an eligible group or scheme. Ask about membership and the benefits available to you.</p>}{p.documents.length?<div>{p.documents.map(d=><a key={d.id} href={d.file} target="_blank" rel="noopener noreferrer">{d.title} <span className="text-sm">({d.kind.replace('Carrier ','')})</span></a>)}</div>:<p className="text-sm">No brochure is available here yet. Ask Joanson for current plan information.</p>}{p.source&&<a href={p.source} target="_blank" rel="noopener noreferrer" className="text-sm">Official insurer information</a>}</article>)}</section>})}</div>
 <section className="max-w-3xl space-y-3 text-sm leading-relaxed text-slate-600"><h2 className="text-xl font-semibold text-brand">About these documents</h2><p>Documents may describe an earlier edition of a plan. Ask for the current policy wording, benefit schedule and a written quotation before choosing insurance. An application, newsletter or member handbook is labelled separately from a brochure. Please do not upload completed applications or medical records to this website.</p><Link href="/book" className="button-primary">Discuss these options</Link></section></div>
}
