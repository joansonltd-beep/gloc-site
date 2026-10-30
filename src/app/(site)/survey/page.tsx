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
        Insurance needs and priorities
      </h1>
      <p className="mt-4 leading-relaxed text-slate-600">
        I am Joanson “Joey” Baptiste James. I am building my insurance practice and
        would appreciate your views on insurance, the service you expect and
        the financial priorities that matter to you. Your answers help me
        understand people’s needs and improve the guidance I offer. Completing
        this survey does not commit you to buying anything. You can request a
        conversation at the end if you would like help.
      </p>
      <MarketSurvey />
    </div>
  );
}
