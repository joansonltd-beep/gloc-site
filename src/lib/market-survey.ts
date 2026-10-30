import definitions from './market-survey-questions.json';
export type Answers = Record<string, string | string[]>;
export const exclusive = (s: string) => /^(Not sure|Prefer not to say|Nothing at present|Nothing in particular|None of these|I do not know|I am not sure where to begin|None at present|Nothing specific at present)/.test(s);
export function questionsFor(a: Answers) {
  const ids = ['Q1'];
  if (a.Q1 === 'Yes') ids.push('Y1', 'Y2', 'Y3');
  if (a.Q1 === 'No') {
    ids.push('N1');
    if (a.N1 === 'Yes') ids.push('N2');
    if (a.N1 === 'No') {
      ids.push('N3');
      if (a.N3 === 'Yes, but I did not apply') ids.push('N4');
      if (a.N3 === 'Yes, I applied but did not take out a policy') {
        ids.push('N5');
        if (a.N5 === 'I received an offer but decided not to proceed') ids.push('N5a');
        if (a.N5 === 'I did not complete the application') ids.push('N5b');
      }
      if (a.N3 === 'No') ids.push('N6');
      if (a.N3 === 'Not sure') ids.push('N9');
    }
    if (a.N1 === 'Not sure') {
      ids.push('N7');
      if (Array.isArray(a.N7) && a.N7.length && !a.N7.includes('Prefer not to say')) ids.push('N8');
    }
  }
  if (a.Q1 === 'Not sure') {
    ids.push('U1');
    if (Array.isArray(a.U1) && a.U1.length && !a.U1.some(exclusive)) ids.push('U2');
    else ids.push('U3');
  }
  if (a.Q1) {
    ids.push('C1');
    if (Array.isArray(a.C1) && a.C1.length > 1) ids.push('C2');
    ids.push('C3', 'C4', 'C5', 'F1');
  }
  return ids.map(id => {
    const q = definitions.find(q => q.id === id)!;
    let options = q.options.filter(o => o !== 'Skip');
    if (id === 'C2') options = Array.isArray(a.C1) ? a.C1 : [];
    if (id === 'C4') options = options.filter(o => {
      if (o === 'Reviewing existing coverage') return a.Q1 === 'Yes';
      if (o === 'Checking whether I already have coverage') return a.Q1 === 'Not sure';
      if (o === 'Replacing coverage that ended') return a.Q1 === 'No' && a.N1 === 'Yes';
      if (o === 'Exploring insurance for the first time') return a.N1 === 'No' && a.N3 === 'No';
      return true;
    });
    return { ...q, options };
  });
}

export function cleanAnswers(input: Answers): Answers {
  const clean: Answers = {};
  // Determine each next question from already-validated parent answers.
  for (const q of definitions) {
    const active = questionsFor(clean).find(x => x.id === q.id);
    if (!active) continue;
    const value = input[q.id];
    if (q.id === 'C5') {
      if (typeof value === 'string' && value.trim()) clean[q.id] = value.trim().slice(0, 1000);
    } else if (q.multi && Array.isArray(value)) {
      let selected = [...new Set(value.filter(v => active.options.includes(v)))];
      if (selected.some(exclusive)) selected = [selected.find(exclusive)!];
      if (q.max) selected = selected.slice(0, q.max);
      if (selected.length) clean[q.id] = selected;
    } else if (typeof value === 'string' && active.options.includes(value)) clean[q.id] = value;
    if (Array.isArray(clean[q.id]) && clean[q.id].includes('Other') && typeof input[q.id + 'Other'] === 'string') clean[q.id + 'Other'] = (input[q.id + 'Other'] as string).trim().slice(0, 300);
  }
  if (Array.isArray(clean.C1) && clean.C1.length === 1 && !exclusive(clean.C1[0])) clean.highestPriority = clean.C1[0];
  else if (typeof clean.C2 === 'string') clean.highestPriority = clean.C2;
  return clean;
}

export function surveyLead(raw: Record<string, unknown>) {
  if (!raw.answers || typeof raw.answers !== 'object' || Array.isArray(raw.answers)) return null;
  const answers = cleanAnswers(raw.answers as Answers);
  if (!answers.Q1 || !answers.F1) return null;
  const contact: Record<string, string | boolean> = {};
  if (answers.F1 === 'Yes, I would like to arrange a conversation') {
    if (!['Phone call', 'WhatsApp', 'Email'].includes(String(raw.contactMethod)) || raw.contactConsent !== true) return null;
    const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 200) : '';
    if (!name) return null;
    contact.name = name;
    contact.contactMethod = String(raw.contactMethod);
    contact.contactConsent = true;
    if (raw.contactMethod === 'Email') {
      if (typeof raw.email !== 'string' || raw.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.email)) return null;
      contact.email = raw.email.trim();
    } else {
      if (typeof raw.phone !== 'string' || !/^[+\d\s()-]+$/.test(raw.phone) || raw.phone.replace(/\D/g, '').length < 7 || raw.phone.replace(/\D/g, '').length > 15) return null;
      contact.phone = raw.phone.trim();
      if (raw.contactMethod === 'Phone call' && ['Morning', 'Afternoon', 'Evening', 'No preference'].includes(String(raw.bestTime))) contact.bestTime = String(raw.bestTime);
    }
  }
  return { source: 'jamaica-market-survey', surveyVersion: 2, answers, figures: { market: 'Jamaica', ...answers }, ...contact, message: Object.entries(answers).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n'), submittedAt: new Date().toISOString() };
}
