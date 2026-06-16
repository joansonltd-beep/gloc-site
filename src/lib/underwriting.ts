// INTERNAL underwriting helper. Maps age + total sum assured to the routine
// medical/financial requirements from the Guardian Life of the Caribbean UW
// schedule (Trinidad grid, 1 June 2023). Used only to enrich the lead sheet for
// the agent. Never shown to website visitors.
//
// Requirement codes (see the UW schedule for full definitions): OFT (oral fluid
// test), Medical, LBLPR/FBLPR (limited/full blood profile), MICRO (micro-
// urinalysis), EKG / Stress EKG, PMAR (physician's report), FINQ (financial
// questionnaire), IR (inspection report), FFACL (fact-find cover letter).

type Band = [maxSumAssured: number, requirements: string];

const INF = Number.POSITIVE_INFINITY;

const ADULT_BANDS: { min: number; max: number; bands: Band[] }[] = [
  {
    min: 16,
    max: 30,
    bands: [
      [1_500_000, "None"],
      [2_500_000, "OFT, Medical"],
      [4_000_000, "OFT, Medical, LBLPR"],
      [6_000_000, "OFT, Medical, FBLPR"],
      [10_000_000, "OFT, Medical, FBLPR, FINQ"],
      [INF, "OFT, Medical, FBLPR, FINQ, IR, FFACL"],
    ],
  },
  {
    min: 31,
    max: 40,
    bands: [
      [1_500_000, "None"],
      [2_500_000, "OFT, Medical"],
      [4_000_000, "OFT, Medical, LBLPR"],
      [6_000_000, "OFT, Medical, FBLPR"],
      [10_000_000, "OFT, Medical, FBLPR, FINQ"],
      [INF, "OFT, Medical, FBLPR, EKG, FINQ, IR, FFACL"],
    ],
  },
  {
    min: 41,
    max: 50,
    bands: [
      [1_500_000, "None"],
      [2_500_000, "OFT, Medical"],
      [4_000_000, "OFT, Medical, LBLPR"],
      [6_000_000, "OFT, Medical, FBLPR"],
      [10_000_000, "OFT, Medical, FBLPR, MICRO, EKG, FINQ"],
      [INF, "OFT, Medical, FBLPR, MICRO, EKG, FINQ, IR, FFACL"],
    ],
  },
  {
    min: 51,
    max: 60,
    bands: [
      [500_000, "None"],
      [1_500_000, "Medical"],
      [2_500_000, "OFT, Medical, LBLPR, Micro"],
      [4_000_000, "OFT, Medical, FBLPR, Micro"],
      [6_000_000, "OFT, Medical, FBLPR, Micro, EKG"],
      [10_000_000, "OFT, Medical, FBLPR, MICRO, EKG, PMAR, FINQ"],
      [INF, "OFT, Medical, FBLPR, MICRO, Stress EKG, PMAR, FINQ, IR, FFACL"],
    ],
  },
  {
    min: 61,
    max: 65,
    bands: [
      [500_000, "Medical"],
      [1_500_000, "Medical, LBLPR, Micro"],
      [2_500_000, "OFT, Medical, FBLPR, Micro"],
      [3_500_000, "OFT, Medical, FBLPR, Micro, EKG"],
      [6_000_000, "OFT, Medical, FBLPR, Micro, EKG, PMAR"],
      [10_000_000, "OFT, Medical, FBLPR, MICRO, Stress EKG, PMAR, FINQ"],
      [INF, "OFT, Medical, FBLPR, MICRO, Stress EKG, PMAR, FINQ, IR, FFACL"],
    ],
  },
  {
    min: 66,
    max: 200,
    bands: [
      [500_000, "Medical"],
      [1_500_000, "Medical, FBLPR, Micro"],
      [3_500_000, "OFT, Medical, FBLPR, Micro, EKG, PMAR"],
      [6_000_000, "OFT, Medical, FBLPR, Micro, Stress EKG, PMAR"],
      [10_000_000, "OFT, Medical, FBLPR, MICRO, Stress EKG, PMAR, FINQ"],
      [INF, "OFT, Medical, FBLPR, MICRO, Stress EKG, PMAR, FINQ, IR, FFACL"],
    ],
  },
];

// Returns the indicated routine requirements, or "" if age/sum assured unknown.
export function routineRequirements(age?: number, sumAssured?: number): string {
  if (age == null || sumAssured == null || sumAssured <= 0) return "";

  if (age < 16) {
    // Children: simplified (rare for this audience).
    return sumAssured <= 500_000 ? "None" : "PMAR (medical evidence may apply)";
  }

  const group = ADULT_BANDS.find((g) => age >= g.min && age <= g.max);
  if (!group) return "";
  const band = group.bands.find(([max]) => sumAssured <= max);
  return band ? band[1] : "";
}

// Age in whole years from an ISO date string (yyyy-mm-dd).
export function ageFromDob(dob: string): number | undefined {
  if (!dob) return undefined;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : undefined;
}
