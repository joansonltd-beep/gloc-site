// Prospect fields and compatibility for records saved before the contact form update.
const stages = ['New lead','Contacted','Qualified','Appointment set','Follow-up due','Converted','Not a fit','Archived'];
const sources = ['Insurance ad','Personal prospecting','Referral','Other'];
const insuranceStatuses = ['Has insurance','Has insurance and is considering more',"Don't have but considering","Don't have and not considering",'Not sure','No coverage'];
const qualification = {
  employment: ['Employed','Self-employed','Unemployed','Student','Retired','Other'],
  salary: ['Yes','No','Checking'],
  insurance: insuranceStatuses,
  commitment: ['Ready to discuss a budget','Interested, exploring options','Not ready','Declined'],
  method: ['WhatsApp','Phone','Email','Social media'],
  consent: ['Permission documented','Declined','Do not contact']
};
const scriptIds = ['whatsapp-first','whatsapp-follow','phone-first','phone-qualify','email-first','email-follow','social-public','social-dm'];
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
function clean(value: unknown, length = 500) { return typeof value === 'string' ? value.trim().slice(0, length) : ''; }
function option(value: unknown, values: string[], fallback = '') { return typeof value === 'string' && values.includes(value) ? value : fallback; }
function dateOnly(value: unknown) {
  const date = clean(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : '';
}
function normalizeLead<T extends Record<string, unknown>>(body: T) {
  const enquiry = body.enquiry && typeof body.enquiry === 'object' ? body.enquiry as Record<string,unknown> : {};
  const joined = (...values: unknown[]) => [...new Set(values.map(value=>clean(value,20000)).filter(Boolean))].join('\n\n');
  const contactDetails = body.detailsVersion === 2 ? clean(body.contactDetails,5000) : joined(body.contactDetails,body.confirmedContact,body.unverifiedContact);
  const notes = body.detailsVersion === 2 ? clean(body.notes,20000) : joined(body.notes,body.verifiedNotes,body.unverifiedNotes);
  const phone = typeof body.phone === 'string' ? clean(body.phone,30) : clean(enquiry.phone,30) || contactDetails.match(/\+?\d[\d ()-]{5,}\d/)?.[0]?.trim() || '';
  const email = typeof body.email === 'string' ? clean(body.email,254) : clean(enquiry.email,254) || contactDetails.match(/[^\s<>]+@[^\s<>]+\.[^\s<>]+/)?.[0] || '';
  const emailConsent = (body.emailConsent ?? enquiry.emailConsent) === true && Boolean(email);
  const reportedCover = clean(enquiry.currentCover);
  const fallbackCover = ['Have coverage','Have some coverage'].includes(reportedCover) ? 'Has insurance' : reportedCover;
  const insurance = body.insurance === 'Actively considering' ? "Don't have but considering" : body.insurance === 'Neither' ? "Don't have and not considering" : clean(body.insurance) || fallbackCover;
  return {...body,phone,email,emailConsent,emailPermission:emailConsent?'Permission given':'Permission not given',contactDetails,notes,insurance,detailsVersion:2};
}
function leadFrom(body: Record<string, unknown>) {
  const details = normalizeLead(body);
  const lead = Object.fromEntries(Object.entries(qualification).map(([key, values]) => [key, option(details[key as keyof typeof details], values)]));
  for (const key of ['name','campaign','bestTime','nextAction','consentEvidence','appointment']) lead[key] = clean(body[key]);
  lead.source = option(body.source, sources);
  lead.status = option(body.status, stages, stages[0]);
  lead.followUp = dateOnly(body.followUp);
  const coverage = Array.isArray(body.coverage) ? [...new Set(body.coverage.map(value => clean(value, 80)).filter(Boolean))].slice(0, 12) : [];
  return {...lead,name:lead.name,consent:lead.consent,consentEvidence:lead.consentEvidence,appointment:lead.appointment,
    phone:details.phone,email:details.email,emailConsent:details.emailConsent,emailPermission:details.emailPermission,
    contactDetails:details.contactDetails,notes:details.notes,insurance:lead.insurance,detailsVersion:2,coverage};
}
export { json, clean, leadFrom, normalizeLead, scriptIds };
