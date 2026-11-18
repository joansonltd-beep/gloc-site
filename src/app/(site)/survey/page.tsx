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
      <MarketSurvey>
        <div className="space-y-4 leading-relaxed text-slate-600">
          <p>
            This survey is run by Joanson “Joey” Baptiste James, an insurance
            professional working in Jamaica. A lot of what this industry believes
            about what people want is out of date, and the only way to find out is
            to ask people who are not in the business.
          </p>
          <p>
            You do not need any knowledge of insurance to take part. Whether you
            have insurance, have never had insurance or have never been offered it,
            your perspective is welcome. There are no right or wrong answers.
          </p>
          <p>
            The questions adjust to your answers, and you may leave optional
            questions unanswered. Completing the survey does not commit you to
            buying anything. At the end, you can choose whether you would like a
            conversation about your insurance needs.
          </p>
        </div>
      </MarketSurvey>
    </div>
  );
}
