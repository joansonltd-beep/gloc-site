import 'server-only';
import { Conflict, readDocument, writeDocument } from '@/lib/dashboard/storage';
import { leadFrom } from './model';
import { enquiryConsent, type parseEnquiry } from '@/lib/insurance-enquiry';

type Enquiry = NonNullable<ReturnType<typeof parseEnquiry>>;
export type Lead = ReturnType<typeof leadFrom> & {
  id: string; revision: number; updatedAt: string;
  enquiry?: Enquiry & { receivedAt: string; consentText: string };
};
type Script = {id: string; revision: number; title: string; text: string};
type Desk = {leads: Lead[]; scripts: Script[]};
export const deskPath = 'dashboard/lead-desk-v1.json';
export const emptyDesk: Desk = {leads: [], scripts: []};

export async function saveEnquiry(enquiry: Enquiry) {
  const receivedAt = new Date().toISOString();
  const { requestId, name, phone, email, emailConsent, employment, goal, currentCover, timeframe, method, notes, entry, dateOfBirth, incomeType, incomeAmount, incomeFrequency, contactDays, contactWindows, company, headcount, coverAmount, purpose } = enquiry;
  const bestTime = contactDays.join(", ") + " · " + contactWindows.join(", ");
  const record: Lead = {
    ...leadFrom({
      name, source: 'Other', campaign: entry, coverage: [goal],
      phone, email, emailConsent, insurance: currentCover === 'Have coverage' || currentCover === 'Have some coverage' ? 'Has insurance' : currentCover, employment: employment === 'Not employed' ? 'Unemployed' : employment,
      method, bestTime,
      consentEvidence: `Website enquiry, ${receivedAt}. ${enquiryConsent} Permission applies to this enquiry only.`,
      dateOfBirth, incomeType, incomeAmount, incomeFrequency, contactDays, contactWindows,
      timeframe, company, headcount, coverAmount, purpose, surveyResponses: enquiry.survey,
      notes,

    }),
    id: requestId, revision: 1, updatedAt: receivedAt,
    enquiry: { ...enquiry, receivedAt, consentText: enquiryConsent },
  };

  for (let attempt = 0; attempt < 4; attempt++) {
    const { value, etag } = await readDocument(deskPath, emptyDesk);
    if (value.leads.some(item => item.id === requestId)) return;
    try {
      await writeDocument(deskPath, { ...value, leads: [record, ...value.leads] }, etag);
      return;
    } catch (error) {
      if (!(error instanceof Conflict) || attempt === 3) throw error;
    }
  }
}
