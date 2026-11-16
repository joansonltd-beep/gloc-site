import type { Metadata } from "next";
import InsuranceEnquiry from "@/components/InsuranceEnquiry";
import { ageRanges, coverageGoals, enquiryChoice } from "@/lib/insurance-enquiry";

export const metadata: Metadata = {
  title: "Insurance enquiry",
  description: "Request a conversation about insurance options in Jamaica.",
  robots: { index: false, follow: true },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ age?: string; goal?: string }> }) {
  const { age, goal } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold text-brand sm:text-4xl">Request an insurance consultation</h1>
      <p className="mt-3 text-slate-600">Share a few details so Joanson can get in touch and prepare for the conversation.</p>
      <InsuranceEnquiry age={enquiryChoice(age, ageRanges)} goal={enquiryChoice(goal, coverageGoals)} />
    </div>
  );
}
