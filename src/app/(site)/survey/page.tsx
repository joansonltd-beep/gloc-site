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
      <h1 className="mt-4 text-4xl font-semibold text-brand">
        Insurance needs and priorities
      </h1>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
        <p>
          I am Joanson “Joey” Baptiste James, an insurance professional expanding
          my practice into Jamaica. This survey helps me understand your
          priorities, your views on insurance and the information or assistance
          you would find useful.
        </p>
        <p>
          You do not need any knowledge of insurance to take part. Whether you
          have coverage, have never had insurance or have never been offered it,
          your perspective is welcome. There are no right or wrong answers.
        </p>
        <p>
          The questions adjust to your answers, and you may leave optional
          questions unanswered. Completing the survey does not commit you to
          buying anything. At the end, you can choose whether you would like a
          conversation about your insurance needs.
        </p>
      </div>
      <MarketSurvey />
    </div>
  );
}
