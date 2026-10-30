require('tsx/cjs');
const assert = require('node:assert/strict');
const {questionsFor,cleanAnswers,surveyLead} = require('../src/lib/market-survey.ts');
const defs = require('../src/lib/market-survey-questions.json');
const ids = a => questionsFor(a).map(q=>q.id);
assert.deepEqual(ids({}), ['Q1']);
for (const q of defs.filter(q=>['Q1','N1','N3','N5'].includes(q.id))) {
  for (const option of q.options.filter(o=>o!=='Skip')) {
    const a={Q1:'No',N1:'No',N3:'Yes, I applied but did not take out a policy',[q.id]:option};
    const active=ids(cleanAnswers(a));
    assert(active.includes('F1'));
    if(a.Q1==='Yes') assert(!active.includes('N1'));
    if(a.Q1==='Not sure') assert(active.includes('U1'));
  }
}
assert(ids({Q1:'No',N1:'No',N3:'No'}).includes('N6'));
assert(ids({Q1:'No',N1:'No',N3:'Not sure'}).includes('N9'));
assert(ids({Q1:'No',N1:'Not sure',N7:['A parent or relative handled these arrangements']}).includes('N8'));
assert(!ids({Q1:'No',N1:'Not sure',N7:['Prefer not to say']}).includes('N8'));
assert(ids({Q1:'Not sure',U1:['I may have coverage through my employer']}).includes('U2'));
assert(!ids({Q1:'Not sure',U1:['None of these']}).includes('U2'));
assert(ids({Q1:'Not sure',U1:['None of these']}).includes('U3'));
const changed=cleanAnswers({Q1:'Yes',N1:'No',N3:'No',N6:['Other'],N6Other:'obsolete',C4:['Exploring insurance for the first time'],F1:'Not at the moment'});
assert(!changed.N1 && !changed.N6Other && !changed.C4);
assert.equal(cleanAnswers({Q1:'Yes',C1:['Motor insurance'],C2:'Life insurance and family protection'}).highestPriority,'Motor insurance');
assert.deepEqual(cleanAnswers({Q1:'Yes',C1:['Motor insurance','None at present']}).C1,['None at present']);
assert.equal(cleanAnswers({Q1:'Yes',C1:['Motor insurance','Home or property insurance'],C2:'Business protection'}).highestPriority,undefined);
assert(!cleanAnswers({Q1:'Yes',Y1:['Life insurance'],Y1Other:'stale'}).Y1Other);
const base={answers:{Q1:'No',F1:'Not at the moment'},name:'discard',phone:'1234567',contactConsent:true};
assert(!surveyLead(base).name);
assert(!surveyLead({answers:{Q1:'Yes',F1:'Yes, I would like to arrange a conversation'}}));
for(const method of ['Email','WhatsApp','Phone call']) {
  const lead=surveyLead({answers:{Q1:'Yes',F1:'Yes, I would like to arrange a conversation'},contactMethod:method,contactConsent:true,name:'Test',email:'test@example.com',phone:'+18765550100',bestTime:'Morning'});
  assert(lead);
  assert.equal(!!lead.email,method==='Email');
  assert.equal(!!lead.phone,method!=='Email');
  assert.equal(!!lead.bestTime,method==='Phone call');
}
console.log('Survey branch, backtracking, priority and contact validation checks passed.');
