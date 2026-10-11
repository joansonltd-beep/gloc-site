import { ToolFrame } from "./ToolUI";
export default function CriticalIllnessExplorer() {
  return (
    <ToolFrame
      title="Questions about critical illness cover"
      intro="Start with the policy wording. Benefits and eligibility depend on the specific contract."
    >
      <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
        <li>
          Which conditions are covered, and how does the policy define them?
        </li>
        <li>Are there waiting periods, survival periods or exclusions?</li>
        <li>
          What would you need for treatment, time away from work and household
          expenses?
        </li>
        <li>
          How does this fit with any health or life cover you already have?
        </li>
      </ul>
      <p className="mt-5 text-sm text-slate-600">
        Treatment costs vary. Ask your healthcare provider for a current
        estimate before entering a cost into a plan.
      </p>
    </ToolFrame>
  );
}
