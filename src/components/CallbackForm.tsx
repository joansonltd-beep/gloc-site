import InsuranceEnquiry from "@/components/InsuranceEnquiry";

export default function CallbackForm() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-brand">Request a consultation</h2>
      <InsuranceEnquiry entry="Consultation request" />
    </section>
  );
}
