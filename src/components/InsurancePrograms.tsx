import Link from "next/link";
import catalogue from "@/lib/public-insurers.json";
export default function InsurancePrograms({pageKey}:{pageKey:string}) {
 const topic=pageKey.split('/').pop() || '';
 const carriers=catalogue.carriers.filter(carrier=>catalogue.products.some(product=>product.carrier===carrier.name && product.topics.includes(topic)));
 if(!carriers.length)return null;
 return <section className="insurer-links" aria-labelledby="insurer-options"><h2 id="insurer-options">Explore plans from these insurers</h2>
 <p>Choose an insurer to see its products and available brochures on this website. Current availability and eligibility will be checked before you apply.</p>
 <ul>{carriers.map(carrier=><li key={carrier.slug}><Link href={`/insurers/${carrier.slug}#${topic}`}>{carrier.name}<span aria-hidden> →</span></Link></li>)}</ul></section>;
}
