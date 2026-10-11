import type { Metadata } from "next";
import MarketSurvey from "@/components/MarketSurvey";
export const metadata: Metadata = {
  title: "Jamaica Planning Survey",
  description:
    "Share what matters to you about insurance and financial planning in Jamaica.",
  robots: { index: false, follow: true },
};
export default function SurveyPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Your perspective</p>
      <h1 className="mt-4 text-4xl font-semibold text-brand">
        What matters to you?
      </h1>
      <p className="mt-4 leading-relaxed text-slate-600">
        I am Joanson Baptiste James. This short survey helps me understand the
        questions people in Jamaica have about insurance and financial planning.
      </p>
      <MarketSurvey />
    </div>
  );
}
