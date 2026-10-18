import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readBoundedText, BodyTooLarge } from '../src/lib/requestBody';
import { allowedLeadOrigin, validLead } from '../src/lib/leadValidation';
import { LINE_DETAILS } from '../src/lib/content';
import { POST } from '../src/app/api/lead/route';
import robots from '../src/app/robots';

const request = (body: string, headers: Record<string, string> = {}) => new Request('https://www.joansonbjames.com/api/lead', { method: 'POST', body, headers });

test('byte limits count multibyte input and cancel overflowing streams with absent or false lengths', async () => {
  assert.equal(await readBoundedText(request('é'), 2), 'é');
  await assert.rejects(readBoundedText(request('é'), 1), BodyTooLarge);
  for (const headers of [{}, { 'content-length': '1' }]) {
    let cancelled = false;
    const stream = new ReadableStream({ pull(c) { c.enqueue(new Uint8Array(4)); }, cancel() { cancelled = true; } });
    const req = new Request('https://example.com', { method: 'POST', body: stream, headers, duplex: 'half' } as RequestInit);
    await assert.rejects(readBoundedText(req, 5), BodyTooLarge);
    assert.equal(cancelled, true);
  }
  await assert.rejects(readBoundedText(request('x', { 'content-length': '100' }), 5), BodyTooLarge);
});

const fixtures = [
  { source: 'callback-form', name: 'Test Person', phone: '18765550123', website: '', figures: { name: 'Test Person', phone: '18765550123', bestTime: 'Anytime', goals: ['Health insurance'], message: 'Synthetic fixture' } },
  { source: 'jamaica-market-survey', consent: true, figures: { market: 'Jamaica', topic: 'Family and health cover', priority: 'Clear information', notes: '' } },
  { source: 'term-insurance', name: 'Test Person', phone: '', figures: { name: 'Test Person', dateOfBirth: '1990-01-01', age: 36, amountRequired: 100000, contactMethod: 'Email', contact: 'fixture@example.invalid' } },
  { source: 'group-benefits', figures: { headcount: 10, hasExistingCover: 'no' } },
  { source: 'life-needs-calculator', figures: { currency: 'JMD', monthlyExpenses: 100, years: 5, debts: 0, otherNeeds: 0, savings: 0, existingCover: 0, gap: 6000 } },
  { source: 'quick-quote', figures: { estimatedValue: '100000' } },
  ...['pension-projector', 'investment-projector'].map(source => ({ source, figures: { currency: 'JMD', monthly: 10, lumpSum: 0, years: 5, returnAssumption: 5, inflationAssumption: 3, illustratedTotal: 700 } })),
  ...['book-page', 'mobile-bar', 'float-button', 'discovery-router', ...LINE_DETAILS.map(line => `line-${line.slug}`)].map(source => ({ source })),
];

test('every existing source accepts its normal payload; unknown and nested fields are rejected', () => {
  for (const fixture of fixtures) assert.equal(validLead({ ...fixture, message: 'Synthetic test', page: '/contact', submittedAt: '2026-10-18T12:00:00.000Z' }), true, fixture.source);
  for (const lead of [
    { source: 'unknown' }, { source: 'book-page', token: 'injected' },
    { source: 'book-page', message: { html: 'bad' } },
    { source: 'group-benefits', figures: { headcount: '10' } },
    { source: 'group-benefits', figures: { headcount: Infinity } },
    { source: 'group-benefits', figures: { unknown: 'value' } },
    { ...fixtures[1], consent: false },
    { source: 'term-insurance', name: 'Test Person', figures: { dateOfBirth: '1990-02-31', amountRequired: 100, contactMethod: 'Email', contact: 'fixture@example.invalid' } },
  ]) assert.equal(validLead(lead), false);
});

test('same-origin beacons work and explicit cross-site origins are refused', () => {
  assert.equal(allowedLeadOrigin(request('{}')), true);
  assert.equal(allowedLeadOrigin(request('{}', { origin: 'https://www.joansonbjames.com' })), true);
  const blocked: Record<string, string>[] = [{ origin: 'https://attacker.invalid' }, { origin: 'null' }, { 'sec-fetch-site': 'cross-site' }];
  for (const headers of blocked) assert.equal(allowedLeadOrigin(request('{}', headers)), false);
});

test('lead route forwards only valid fixtures to an isolated mock and never logs personal details', async () => {
  const originalFetch = globalThis.fetch;
  const originalLog = console.info;
  const originalError = console.error;
  const originalWebhook = process.env.LEAD_WEBHOOK_URL;
  const forwarded: unknown[] = [];
  const logs: unknown[][] = [];
  globalThis.fetch = async (_url, options) => { forwarded.push(JSON.parse(String(options?.body))); return new Response('', { status: 200 }); };
  console.info = (...args) => { logs.push(args); };
  console.error = (...args) => { logs.push(args); };
  try {
    process.env.LEAD_WEBHOOK_URL = 'https://webhook.example.invalid';
    for (const fixture of fixtures) {
      const result = await POST(request(JSON.stringify(fixture)));
      assert.equal((await result.json()).forwarded, true, fixture.source);
    }
    const count = forwarded.length;
    for (const body of ['{', JSON.stringify({ source: 'unknown' }), JSON.stringify({ ...fixtures[0], website: 'spam' }), 'x'.repeat(65537)]) await POST(request(body));
    assert.equal((await POST(request('{}', { origin: 'https://attacker.invalid' }))).status, 403);
    assert.equal(forwarded.length, count);
    delete process.env.LEAD_WEBHOOK_URL;
    await POST(request(JSON.stringify(fixtures[0])));
    process.env.LEAD_WEBHOOK_URL = 'https://webhook.example.invalid';
    globalThis.fetch = async () => { throw new Error('SENSITIVE URL OR PAYLOAD'); };
    await POST(request(JSON.stringify(fixtures[0])));
    const text = JSON.stringify(logs);
    assert.ok(!text.includes('Test Person') && !text.includes('18765550123') && !text.includes('SENSITIVE'));
  } finally {
    globalThis.fetch = originalFetch; console.info = originalLog; console.error = originalError;
    if (originalWebhook === undefined) delete process.env.LEAD_WEBHOOK_URL; else process.env.LEAD_WEBHOOK_URL = originalWebhook;
  }
});

test('crawler policy preserves public search and private path exclusions', () => {
  const rules = robots().rules;
  assert.ok(Array.isArray(rules));
  const general = rules.find(rule => rule.userAgent === '*');
  assert.equal(general?.allow, '/');
  assert.ok(Array.isArray(general?.disallow) && general.disallow.includes('/dashboard'));
  const training = rules.find(rule => Array.isArray(rule.userAgent) && rule.userAgent.includes('GPTBot'));
  assert.equal(training?.disallow, '/');
  assert.ok(!JSON.stringify(training).includes('Googlebot') && !JSON.stringify(training).includes('Bingbot'));
});
