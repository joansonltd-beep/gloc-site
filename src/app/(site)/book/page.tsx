import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import InsuranceEnquiry from "@/components/InsuranceEnquiry";
import WhatsAppCTA from "@/components/tools/WhatsAppCTA";
import AdsConversion from "@/components/AdsConversion";

export const metadata: Metadata = pageMetadata({
  title: "Request a consultation",
  description: "Request a conversation with Joanson Baptiste James about insurance in Jamaica. Share a few details and choose when to be contacted.",
  alternates: { canonical: "/book" },
});

export default function BookPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <AdsConversion sendTo="AW-18282133568/QM1DCMyU7sccEMDwzI1E" />
      <header>
        <h1 className="mt-2 text-3xl font-semibold">Request a consultation</h1>
        <p className="mt-3">Tell Joanson a little about yourself and what you would like help with. Complete the questions below to request a conversation.</p>
        <p className="mt-3">After you send your request, Joanson will contact you to arrange a suitable time. There is no obligation to buy insurance.</p>
      </header>
      <InsuranceEnquiry entry="Consultation request" />
      <div className="mt-8">
        <p className="mb-3">Prefer to message now?</p>
        <WhatsAppCTA message="Hi Joanson, I would like to arrange a conversation about insurance." label="Message on WhatsApp" lead={{ source: "book-page" }} />
      </div>
    </div>
  );
}
