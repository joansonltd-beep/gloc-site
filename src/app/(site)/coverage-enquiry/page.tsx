import CoverageEnquiry from "@/components/CoverageEnquiry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Look at your coverage gaps",
  description: "An insurance enquiry for employed and self employed people in Jamaica. Share your priorities with Joanson Baptiste James, Insurance Agent.",
  alternates: { canonical: "/coverage-enquiry" },
});

export default function CoverageEnquiryPage() {
  return <div className="mx-auto max-w-2xl space-y-7">
    <header>
      <p className="text-sm font-semibold text-brand">Joanson Baptiste James · Insurance Agent</p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight text-brand sm:text-4xl">Your income already has a job. Who takes over if you cannot?</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">Rent still comes due. Children still need looking after. Before adding another policy, it helps to understand what protection would actually support the life you are building.</p>
      <p className="mt-4 leading-relaxed text-slate-600">For employed and self employed people in Jamaica looking at protection for themselves or their families. This enquiry is designed around personal gross earnings of J$150,000 or more a month, equivalent to J$1.8 million a year. If your circumstances differ, you can still enquire.</p>
    </header>
    <CoverageEnquiry />
    <p className="text-xs text-slate-500">Joanson Baptiste James is an Insurance Agent. Products are subject to terms and conditions.</p>
  </div>;
}
