import { cleanAnswers, type Answers } from "./market-survey";

export const ageRanges = ["18 to 25", "26 to 35", "36 to 45", "46 to 55", "56 to 65", "66 or older", "Prefer not to say"] as const;
export const coverageGoals = ["Life insurance", "Term insurance", "Health insurance", "Critical illness cover", "Personal accident", "Retirement planning", "Investments", "Group coverage", "Help choosing coverage"] as const;
export const employmentTypes = ["Employed", "Self-employed", "Retired", "Not employed"] as const;
export const incomeTypes = ["Salaried", "Commission", "Sales", "Mixed", "Pension", "Other", "No income"] as const;
export const incomeFrequencies = ["Daily", "Fortnightly", "Monthly"] as const;
export const contactDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export const contactWindows = ["Morning (8 am to noon)", "Afternoon (noon to 4 pm)", "Evening (4 to 8 pm)"] as const;
export const coverStatuses = ["Have coverage", "Have some coverage", "Don't have but considering", "Don't have and not considering", "Not sure"] as const;
export const timeframes = ["Within a month", "In the next few months", "Just exploring"] as const;
export const contactMethods = ["Phone", "WhatsApp", "Email"] as const;
export const enquiryEntries = ["Coverage finder", "Consultation request", "Coverage enquiry", "Term insurance enquiry", "Group benefits enquiry", "Market survey"] as const;
export type EnquiryEntry = typeof enquiryEntries[number];
export const enquiryConsent = "I agree that Joanson Baptiste James may use these details to respond to my enquiry by my chosen contact method.";

export function enquiryChoice(value: unknown, options: readonly string[]) {
  return typeof value === "string" && options.includes(value) ? value : "";
}

function choices(value: unknown, options: readonly string[]) {
  if (!Array.isArray(value) || !value.length || value.length > options.length || !value.every(item => enquiryChoice(item, options))) return null;
  return options.filter(item => value.includes(item));
}

export function parseEnquiry(body: Record<string, unknown>) {
  const text = (value: unknown, max: number) => typeof value === "string" && value.length <= max ? value.trim() : "";
  const requestId = text(body.requestId, 36);
  const name = text(body.name, 100);
  const phone = text(body.phone, 30);
  const email = text(body.email, 254);
  const emailConsent = body.emailConsent === true;
  if ((body.email !== undefined && typeof body.email !== "string") ||
      (typeof body.email === "string" && body.email.length > 254) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || (emailConsent && !email)) return null;
  const digits = phone.replace(/\D/g, "");
  const age = enquiryChoice(body.age, ageRanges);
  const goal = enquiryChoice(body.goal, coverageGoals);
  const employment = enquiryChoice(body.employment, employmentTypes);
  const currentCover = enquiryChoice(body.currentCover, [...coverStatuses, "No coverage"]);
  const timeframe = enquiryChoice(body.timeframe, timeframes);
  const method = enquiryChoice(body.method, contactMethods);
  const entry = enquiryChoice(body.entry, enquiryEntries);
  const dateOfBirth = text(body.dateOfBirth, 10);
  const birth = new Date(dateOfBirth);
  const incomeType = enquiryChoice(body.incomeType, incomeTypes);
  const hasIncome = incomeType !== "No income";
  const amount = text(body.incomeAmount, 18);
  const incomeAmount = hasIncome ? Number(amount) : 0;
  const incomeFrequency = hasIncome ? enquiryChoice(body.incomeFrequency, incomeFrequencies) : "";
  const days = choices(body.contactDays, contactDays);
  const windows = choices(body.contactWindows, contactWindows);
  const survey = entry === "Market survey" && body.survey && typeof body.survey === "object" && !Array.isArray(body.survey)
    ? cleanAnswers(body.survey as Answers) : undefined;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(requestId) ||
      !name || !/^\+?[\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || dateOfBirth < "1900-01-01" || !Number.isFinite(birth.getTime()) ||
      birth.toISOString().slice(0, 10) !== dateOfBirth || birth > new Date() ||
      !entry || !goal || !employment || !currentCover || !timeframe || !method || !days || !windows ||
      !incomeType || (hasIncome && (!/^\d+(?:\.\d{1,2})?$/.test(amount) || !Number.isFinite(incomeAmount) || incomeAmount <= 0 || !incomeFrequency)) ||
      (entry === "Market survey" && (!survey?.Q1 || survey.F1 !== "Yes, I would like to arrange a conversation" || body.informationConsent !== true)) ||
      body.contactConsent !== true || (method === "Email" && (!email || !emailConsent))) return null;
  const company = entry === "Group benefits enquiry" ? text(body.company, 100) : "";
  const headcount = entry === "Group benefits enquiry" ? Number(text(body.headcount, 9)) : 0;
  const coverAmount = entry === "Term insurance enquiry" ? Number(text(body.coverAmount, 18)) : 0;
  const purpose = entry === "Term insurance enquiry" ? text(body.purpose, 150) : "";
  if (entry === "Group benefits enquiry" && (!Number.isSafeInteger(headcount) || headcount <= 0)) return null;
  if (entry === "Term insurance enquiry" && (!Number.isFinite(coverAmount) || coverAmount <= 0)) return null;
  return { requestId, name, phone, email, emailConsent, emailPermission: emailConsent ? "Permission given" : "Permission not given", age, dateOfBirth, goal, employment, currentCover, timeframe, method,
    entry, incomeType, incomeAmount, incomeFrequency, contactDays: days, contactWindows: windows,
    notes: text(body.notes, 1000), contactConsent: true as const, company, headcount, coverAmount, purpose,
    ...(survey ? { survey, informationConsent: true as const } : {}) };
}
