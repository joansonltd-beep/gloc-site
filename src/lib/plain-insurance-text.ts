export function plainInsuranceText(text: string): string {
  return text
    .replace(/Health Card\s*&\s*Health Insurance/g, 'Health Insurance')
    .replace(/\bhealth card\b/gi, match => match[0] === 'H' ? 'Health Insurance' : 'health insurance')
    .replace(/\bfree cover limit\b/gi, 'limit for joining without medical evidence')
    .replace(/\bcover (household bills|the costs?|expenses|bills|rent|school fees|debts)\b/gi, 'pay for $1')
    .replace(/\bwhat (each option|a health policy|the policy|it) (would )?covers?\b/gi, (_match, subject: string, modal: string | undefined) => 'what ' + subject + (modal ? ' would include' : ' includes'))
    .replace(/\binsurance coverage\b/gi, match => match[0] === 'I' ? 'Insurance' : 'insurance')
    .replace(/\bcoverage\b/gi, match => match[0] === 'C' ? 'Insurance' : 'insurance')
    .replace(/\bcover\b/gi, match => match[0] === 'C' ? 'Insurance' : 'insurance')
    .replace(/\binsurance insurance\b/gi, match => match[0] === 'I' ? 'Insurance' : 'insurance');
}
