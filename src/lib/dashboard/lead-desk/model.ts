// Input validation adapted from Joey�s Lead Desk.
const stages = ['New lead','Contacted','Qualified','Appointment set','Follow-up due','Converted','Not a fit','Archived'];
const sources = ['Insurance ad','Personal prospecting','Referral','Other'];
const qualification = {
  employment: ['Employed','Self-employed','Unemployed','Student','Retired','Other'],
  salary: ['Yes','No','Checking'],
  insurance: ['Has insurance','Actively considering','Has insurance and is considering more','Neither'],
  commitment: ['Ready to discuss a budget','Interested, exploring options','Not ready','Declined'],
  method: ['WhatsApp','Phone','Email','Social media'],
  consent: ['Permission documented','Declined','Do not contact']
};
const verifiedFields = ['Contact details','Employment status','Salary deduction','Insurance status','Financial willingness','Coverage interest','Contact preference','Appointment'];
const scriptIds = ['whatsapp-first','whatsapp-follow','phone-first','phone-qualify','email-first','email-follow','social-public','social-dm'];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
  });
}

function clean(value: unknown, length = 500) {
  return typeof value === 'string' ? value.trim().slice(0, length) : '';
}
function option(value: unknown, values: string[], fallback = '') {
  return typeof value === 'string' && values.includes(value) ? value : fallback;
}
function dateOnly(value: unknown) {
  const date = clean(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : '';
}
function leadFrom(body: Record<string, unknown>) {
  const lead = Object.fromEntries(Object.entries(qualification).map(([key, values]) => [key, option(body[key], values)]));
  for (const key of ['name','campaign','confirmedContact','unverifiedContact','bestTime','nextAction','verificationSource','consentEvidence','appointment']) {
    lead[key] = clean(body[key]);
  }
  for (const key of ['notes','verifiedNotes','unverifiedNotes']) lead[key] = clean(body[key], 5000);
  lead.source = option(body.source, sources);
  lead.status = option(body.status, stages, stages[0]);
  lead.followUp = dateOnly(body.followUp);
  const coverage = Array.isArray(body.coverage) ? [...new Set(body.coverage.map(value => clean(value, 80)).filter(Boolean))].slice(0, 12) : [];
  const verified = Array.isArray(body.verified) ? [...new Set(body.verified.filter((value): value is string => typeof value === 'string' && verifiedFields.includes(value)))] : [];
  return {...lead, name:lead.name, consent:lead.consent, consentEvidence:lead.consentEvidence, verificationSource:lead.verificationSource, confirmedContact:lead.confirmedContact, appointment:lead.appointment, coverage, verified};
}

export { json, clean, leadFrom, scriptIds };

