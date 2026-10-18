import { LINE_DETAILS } from './content';

const figureFields: Record<string, string[]> = {
  'callback-form': ['name', 'phone', 'bestTime', 'goals', 'message'],
  'jamaica-market-survey': ['market', 'topic', 'priority', 'notes'],
  'term-insurance': ['name', 'dateOfBirth', 'age', 'amountRequired', 'purpose', 'contactMethod', 'contact'],
  'group-benefits': ['headcount', 'hasExistingCover'],
  'life-needs-calculator': ['currency', 'monthlyExpenses', 'years', 'debts', 'otherNeeds', 'savings', 'existingCover', 'gap'],
  'quick-quote': ['estimatedValue'],
  'pension-projector': ['currency', 'monthly', 'lumpSum', 'years', 'returnAssumption', 'inflationAssumption', 'illustratedTotal'],
  'investment-projector': ['currency', 'monthly', 'lumpSum', 'years', 'returnAssumption', 'inflationAssumption', 'illustratedTotal'],
  'book-page': [], 'mobile-bar': [], 'float-button': [], 'discovery-router': [],
};
const sources = new Set([...Object.keys(figureFields), ...LINE_DETAILS.map(line => `line-${line.slug}`)]);
const topFields = new Set(['source', 'message', 'recommended', 'figures', 'name', 'phone', 'website', 'page', 'submittedAt', 'consent']);
const numericFields = new Set(['age', 'amountRequired', 'headcount', 'monthlyExpenses', 'years', 'debts', 'otherNeeds', 'savings', 'existingCover', 'gap', 'monthly', 'lumpSum', 'returnAssumption', 'inflationAssumption', 'illustratedTotal']);
const string = (value: unknown, max: number, required = false): value is string =>
  typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0);
const object = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

export function allowedLeadOrigin(request: Request): boolean {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true; // Same-origin beacons and non-browser clients may omit Origin.
  try {
    const parsed = new URL(origin);
    return ['https:', 'http:'].includes(parsed.protocol) && parsed.host === new URL(request.url).host;
  } catch { return false; }
}

export function validLead(lead: Record<string, unknown>): boolean {
  if (!string(lead.source, 100, true) || !sources.has(lead.source)) return false;
  if (Object.keys(lead).some(key => !topFields.has(key))) return false;
  for (const [key, limit] of Object.entries({ message: 10000, recommended: 2000, name: 200, phone: 100, website: 1000, page: 2000, submittedAt: 40 })) {
    if (lead[key] !== undefined && !string(lead[key], limit)) return false;
  }
  if (lead.page !== undefined && (!(lead.page as string).startsWith('/') || (lead.page as string).startsWith('//'))) return false;
  if (lead.submittedAt !== undefined && !/^\d{4}-\d{2}-\d{2}T/.test(lead.submittedAt as string)) return false;
  if (lead.submittedAt !== undefined && !Number.isFinite(Date.parse(lead.submittedAt as string))) return false;
  if (lead.consent !== undefined && typeof lead.consent !== 'boolean') return false;
  if (lead.source === 'jamaica-market-survey' && lead.consent !== true) return false;
  if (lead.source === 'callback-form') {
    if (!string(lead.name, 200, true) || !string(lead.phone, 100, true)) return false;
    const digits = lead.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return false;
  }
  if (lead.source === 'term-insurance' && !string(lead.name, 200, true)) return false;
  if (lead.figures !== undefined) {
    if (!object(lead.figures)) return false;
    const allowed = figureFields[lead.source] ?? [];
    for (const [key, value] of Object.entries(lead.figures)) {
      if (!allowed.includes(key)) return false;
      if (key === 'goals') {
        if (!Array.isArray(value) || value.length > 20 || value.some(v => !string(v, 200))) return false;
      } else if (numericFields.has(key)) {
        if (value === null && key === 'age') continue;
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return false;
      } else {
        if (!string(value, key === 'notes' || key === 'message' ? 2000 : 1000)) return false;
      }
    }
    if (lead.source === 'term-insurance') {
      const dob = lead.figures.dateOfBirth;
      if (!string(dob, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false;
      const date = new Date(dob);
      if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== dob || date.getTime() > Date.now()) return false;
      if (typeof lead.figures.amountRequired !== 'number' || lead.figures.amountRequired <= 0) return false;
      if (!['Phone', 'Email'].includes(String(lead.figures.contactMethod)) || !string(lead.figures.contact, 1000, true)) return false;
    }
    if (lead.source === 'jamaica-market-survey') {
      if (lead.figures.market !== 'Jamaica' || !string(lead.figures.topic, 1000, true) || !string(lead.figures.priority, 1000, true)) return false;
    }
  } else if (['term-insurance', 'jamaica-market-survey'].includes(lead.source)) return false;
  return true;
}
