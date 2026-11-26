// Prospect fields and compatibility for records saved before the contact form update.
const stages = ['New lead','Contacted','Qualified','Appointment set','Follow-up due','Converted','Not a fit','Archived'];
const sources = ['Insurance ad','Personal prospecting','Referral','Other'];
const insuranceStatuses = ["Don't understand insurance",'Has insurance','Has insurance and is considering more',"Don't have but considering","Don't have and not considering",'Not sure','No coverage'];
const qualification = {
  employment: ['Employed','Employed Full time','Employed Part time','Self-employed','Unemployed','Student','Retired','Other'],
  salary: ['Yes','No','Checking'],
  insurance: insuranceStatuses,
  commitment: ['Ready to discuss a budget','Interested, exploring options','Not ready','Declined'],
  method: ['WhatsApp','iMessage','Phone','Email','Social media'],
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
const kycIncomeTypes = ['Salaried','Commission','Sales','Mixed','Pension','Other','No income'];
const kycFrequencies = ['Daily','Fortnightly','Monthly'];
const kycDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const kycWindows = ['Morning (8 am to noon)','Afternoon (noon to 4 pm)','Evening (4 to 8 pm)'];
function legacyEnquiryNotes(e: Record<string,unknown>, withEmail: boolean) {
  if (!e.dateOfBirth) return '';
  const days = Array.isArray(e.contactDays) ? e.contactDays.join(', ') : '';
  const windows = Array.isArray(e.contactWindows) ? e.contactWindows.join(', ') : '';
  return [withEmail && 'Email contact: '+e.emailPermission, 'Date of birth: '+e.dateOfBirth,
    e.age && 'Finder age range: '+e.age,
    e.incomeType === 'No income' ? 'Income: No income' : 'Income: J$'+e.incomeAmount+' · '+e.incomeType+' · '+e.incomeFrequency,
    'Employment type: '+e.employment,'Coverage interest: '+e.goal,'Current cover: '+e.currentCover,
    'Timeframe: '+e.timeframe,'Contact preference: '+e.method,'Best time: '+days+' · '+windows,
    e.company && 'Company: '+e.company,e.headcount && 'Employees: '+e.headcount,
    e.coverAmount && 'Cover requested: J$'+e.coverAmount,e.purpose && 'Purpose: '+e.purpose,
    e.notes && 'Comments: '+e.notes,
    e.survey && typeof e.survey === 'object' && Object.entries(e.survey).map(([key,value])=>'Survey '+key+': '+(Array.isArray(value)?value.join(', '):value)).join('\n'),
  ].filter(Boolean).join('\n');
}
function leadProfile(body: Record<string,unknown>, enquiry: Record<string,unknown>) {
  const pick = (key: string) => body.profileVersion === 1 || Object.hasOwn(body,key) ? body[key] : enquiry[key];
  const amount = (key: string) => {
    const raw=pick(key); const value=typeof raw==='number'?String(raw):clean(raw,18);
    if (key !== 'incomeAmount' && Number(value) === 0) return '';
    return /^\d+(?:\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) ? value : '';
  };
  const list = (key: string, allowed: string[]) => {
    const value=pick(key); return Array.isArray(value)?allowed.filter(item=>value.includes(item)):[];
  };
  const dob=dateOnly(pick('dateOfBirth'));
  const survey = body.surveyResponses ?? enquiry.survey;
  const surveyResponses: Record<string,string> = {};
  if (survey && typeof survey==='object' && !Array.isArray(survey)) {
    for (const [key,value] of Object.entries(survey).slice(0,100)) {
      surveyResponses[clean(key,80)]=Array.isArray(value)?value.map(item=>clean(item,1000)).join(', '):clean(value,1000);
    }
  }
  return {profileVersion:1,messagingPermission:option(pick('messagingPermission'),['Yes','No']),employmentBasis:option(body.employment ?? enquiry.employment,['Employed Full time','Employed Part time']) ? option(pick('employmentBasis'),['Permanent','Temporary/Contract']) : '',dateOfBirth:dob && dob>='1900-01-01' && new Date(dob)<=new Date()?dob:'',
    incomeType:option(pick('incomeType'),kycIncomeTypes),incomeAmount:amount('incomeAmount'),
    incomeFrequency:option(pick('incomeFrequency'),kycFrequencies),contactDays:list('contactDays',kycDays),contactWindows:list('contactWindows',kycWindows),
    timeframe:option(pick('timeframe'),['Within a month','In the next few months','Just exploring']),
    company:clean(pick('company'),100),headcount:amount('headcount'),coverAmount:amount('coverAmount'),purpose:clean(pick('purpose'),150),surveyResponses};
}
function normalizeLead<T extends Record<string, unknown>>(body: T) {
  const enquiry = body.enquiry && typeof body.enquiry === 'object' ? body.enquiry as Record<string,unknown> : {};
  const joined = (...values: unknown[]) => [...new Set(values.map(value=>clean(value,20000)).filter(Boolean))].join('\n\n');
  const contactDetails = body.detailsVersion === 2 ? clean(body.contactDetails,5000) : joined(body.contactDetails,body.confirmedContact,body.unverifiedContact);
  let notes = body.detailsVersion === 2 ? clean(body.notes,20000) : joined(body.notes,body.verifiedNotes,body.unverifiedNotes);
  if (body.profileVersion !== 1) {
    for (const withEmail of [true,false]) {
      const generated=legacyEnquiryNotes(enquiry,withEmail);
      if (generated && notes.includes(generated)) {
        notes=notes.replace(generated,()=>clean(enquiry.notes,1000)).trim();
        break;
      }
    }
  }
  const profile=leadProfile(body,enquiry);
  const phone = typeof body.phone === 'string' ? clean(body.phone,30) : clean(enquiry.phone,30) || contactDetails.match(/\+?\d[\d ()-]{5,}\d/)?.[0]?.trim() || '';
  const email = typeof body.email === 'string' ? clean(body.email,254) : clean(enquiry.email,254) || contactDetails.match(/[^\s<>]+@[^\s<>]+\.[^\s<>]+/)?.[0] || '';
  const emailConsent = (body.emailConsent ?? enquiry.emailConsent) === true && Boolean(email);
  const reportedCover = clean(enquiry.currentCover);
  const fallbackCover = ['Have coverage','Have some coverage'].includes(reportedCover) ? 'Has insurance' : reportedCover;
  const insurance = body.insurance === 'Actively considering' ? "Don't have but considering" : body.insurance === 'Neither' ? "Don't have and not considering" : clean(body.insurance) || fallbackCover;
  return {...body,...profile,phone,email,emailConsent,emailPermission:emailConsent?'Permission given':'Permission not given',contactDetails,notes,insurance,detailsVersion:2};
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
    ...leadProfile(details,{}),contactDetails:details.contactDetails,notes:details.notes,insurance:lead.insurance,detailsVersion:2,coverage};
}
export { json, clean, leadFrom, normalizeLead, scriptIds };
