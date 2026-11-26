import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const compile=async source=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64'));
const model=(await readFileSync('src/lib/dashboard/lead-desk/model.ts','utf8')).replace('export { json, clean, leadFrom, scriptIds };','');
const route=readFileSync('src/app/dashboard/desk/[[...parts]]/route.ts','utf8').replace(/^import .*;\r?\n/gm,'');
const shim=`
let signed=false, saved, etag, signedOut=false;
class Conflict extends Error {}
const authenticated=async()=>signed;
const sameOrigin=r=>r.headers.get('origin')===new URL(r.url).origin;
const logout=async()=>{signed=false;signedOut=true;return new Response()};
const readDocument=async(path,initial)=>{if(path!=='dashboard/lead-desk-v1.json')throw Error('Unexpected storage path');return {value:saved??initial,etag}};
const writeDocument=async(path,value,expected)=>{if(path!=='dashboard/lead-desk-v1.json'||expected!==etag)throw new Conflict();saved=value;etag=String(Number(etag??0)+1)};
const page='Joey’s Lead Desk';const js='script';const css='styles';
export const signIn=()=>{signed=true}; export const didSignOut=()=>signedOut;
`;
const workspaceSource=readFileSync('src/lib/dashboard/lead-desk/workspace.ts','utf8').replace(/^import .*;\r?\n/gm,'');
const definitions=readFileSync('src/lib/market-survey-questions.json','utf8');
const surveySource=readFileSync('src/lib/market-survey.ts','utf8').replace(/^import .*;\r?\n/gm,'');
const enquirySource=readFileSync('src/lib/insurance-enquiry.ts','utf8').replace(/^import .*;\r?\n/gm,'');
const intakeRoute=readFileSync('src/app/api/lead/route.ts','utf8').replace(/^import .*;\r?\n/gm,'').replace('export async function POST','export async function intake');
const desk=await compile(model+shim+'const definitions='+definitions+';'+surveySource+enquirySource+workspaceSource+route+intakeRoute+'\nexport {legacyEnquiryNotes};');
const request=(parts=[],method='GET',body,origin='https://test.invalid')=>(desk[method](new Request('https://test.invalid/dashboard/desk/'+parts.join('/'),{method,headers:{origin,'content-type':'application/json'},...(body ? {body:JSON.stringify(body)}:{})}),{params:Promise.resolve({parts})}));
assert.equal((await request()).status,307);
assert.equal((await request(['api','workspace'])).status,401);
assert.equal((await request(['app.js'])).status,401);
desk.signIn();
assert.match(await (await request()).text(),/Lead Desk/);
assert.deepEqual(await (await request(['api','workspace'])).json(),{leads:[],scripts:[]});
assert.equal((await request(['api','leads'],'POST',{name:'Fixture'},'https://other.invalid')).status,403);
assert.equal((await request(['api','leads'],'POST',{name:'Fixture',consent:'Permission documented'})).status,400);
assert.equal((await request(['api','leads'],'POST',{name:'x'.repeat(42000)})).status,413);
const created=await request(['api','leads'],'POST',{name:'Synthetic test',insurance:"Don't have but considering",status:'New lead'});
assert.equal(created.status,201);
const lead=await created.json();
const updated=await request(['api','leads',lead.id],'PUT',{...lead,status:'Archived'});
assert.equal(updated.status,200);
assert.equal((await updated.json()).revision,2);
assert.equal((await request(['api','leads',lead.id],'PUT',lead)).status,409);
assert.equal((await request(['api','scripts','email-first'],'PUT',{revision:0,title:'Synthetic',text:'Hello'})).status,200);
const workspace=await (await request(['api','workspace'])).json();
assert.equal(workspace.leads[0].status,'Archived');
assert.equal(workspace.scripts[0].title,'Synthetic');
const form={
  source:'website-insurance-enquiry', requestId:'0a2a9cc3-46ed-415d-8ce3-7070cc2d49fc',
  name:'Website test lead', phone:'+1 (876) 555-0100', age:'26 to 35', goal:'Critical illness cover',
  entry:'Coverage finder', dateOfBirth:'1991-07-16', employment:'Employed', currentCover:'No coverage', timeframe:'Within a month',
  incomeType:'Salaried', incomeAmount:'150000.50', incomeFrequency:'Monthly',
  contactDays:['Sunday','Friday'], contactWindows:['Morning (8 am to noon)','Evening (4 to 8 pm)'],
  method:'WhatsApp', notes:'Test notes', contactConsent:true,
};
const intake=(body=form,origin='https://test.invalid')=>desk.intake(new Request('https://test.invalid/api/lead',{
  method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)
}));
assert.equal((await intake(form,'https://other.invalid')).status,403);
assert.equal((await intake({...form,contactConsent:false})).status,400);
assert.equal((await intake({...form,goal:'Invalid'})).status,400);
for(const patch of [{dateOfBirth:'2000-02-30'},{contactDays:['Saturday']},{contactWindows:[]},{incomeAmount:''},{incomeFrequency:''}]) {
  assert.equal((await intake({...form,...patch})).status,400);
}
const noIncome = desk.parseEnquiry({...form,employment:'Not employed',incomeType:'No income',incomeAmount:'',incomeFrequency:''});
assert.equal(noIncome.incomeAmount,0);
assert.equal(noIncome.incomeFrequency,'');
assert.equal(desk.parseEnquiry({...form,entry:'Group benefits enquiry'}),null);
assert.equal(desk.parseEnquiry({...form,entry:'Group benefits enquiry',headcount:'20'}).headcount,20);
assert.equal(desk.parseEnquiry({...form,entry:'Term insurance enquiry',coverAmount:'5000000'}).coverAmount,5000000);
assert.equal(desk.parseEnquiry({...form,entry:'Market survey',informationConsent:true,survey:{Q1:'Yes',F1:'Yes, I would like to arrange a conversation'}}).survey.Q1,'Yes');
assert.equal((await intake({...form,website:'Filled honeypot'})).status,200);
for (const response of await Promise.all([intake(),intake()])) assert.equal(response.status,201);
const after=(await (await request(['api','workspace'])).json()).leads;
assert.equal(after.length,2);
const captured=after.find(item=>item.id===form.requestId);
for (const key of ['name','phone','age','dateOfBirth','goal','employment','currentCover','timeframe','method','incomeType','incomeFrequency','notes','contactConsent']) assert.equal(captured.enquiry[key],form[key]);
assert.equal(captured.phone,form.phone);
assert.equal(captured.emailPermission,'Permission not given');
assert.equal(captured.emailConsent,false);
assert.equal(captured.consent,'');
assert.match(captured.consentEvidence,/enquiry only/);
assert.equal(captured.notes,form.notes);
assert.equal(captured.dateOfBirth,form.dateOfBirth);
assert.equal(captured.incomeType,form.incomeType);
assert.equal(captured.incomeAmount,'150000.5');
assert.equal(captured.incomeFrequency,form.incomeFrequency);
assert.deepEqual(captured.contactDays,form.contactDays);
assert.deepEqual(captured.contactWindows,form.contactWindows);
assert.deepEqual(captured.enquiry.contactDays,form.contactDays);
assert.deepEqual(captured.enquiry.contactWindows,form.contactWindows);
assert.equal(captured.enquiry.incomeAmount,150000.5);
const edited=await request(['api','leads',captured.id],'PUT',{...captured,status:'Contacted',enquiry:undefined});
assert.equal(edited.status,200);
assert.deepEqual((await edited.json()).enquiry,captured.enquiry);
const legacy=desk.normalizeLead({name:'Legacy',confirmedContact:'+18765550111',unverifiedContact:'legacy@example.com',notes:'Working notes',verifiedNotes:'Earlier notes',unverifiedNotes:'Submitted notes',insurance:'Actively considering'});
assert.equal(legacy.phone,'+18765550111');
assert.equal(legacy.email,'legacy@example.com');
assert.equal(legacy.emailConsent,false);
assert.equal(legacy.emailPermission,'Permission not given');
assert.equal(legacy.insurance,"Don't have but considering");
for(const text of ['Working notes','Earlier notes','Submitted notes'])assert.ok(legacy.notes.includes(text));
assert.deepEqual(desk.normalizeLead(legacy),legacy);
assert.equal((await request(['api','leads'],'POST',{name:'Missing coverage'})).status,400);
const noVerification=await request(['api','leads'],'POST',{name:'No verification needed',insurance:"Don't have and not considering",phone:'+18765550111',email:'test@example.com',emailConsent:false,notes:'All notes',verified:['Contact details','Appointment']});
assert.equal(noVerification.status,201);
assert.equal((await noVerification.json()).emailPermission,'Permission not given');
for(const currentCover of ["Don't have but considering","Don't have and not considering"])assert.equal(desk.parseEnquiry({...form,currentCover}).currentCover,currentCover);
assert.equal(desk.parseEnquiry({...form,currentCover:''}),null);
assert.equal(desk.parseEnquiry({...form,email:'broken'}),null);
assert.equal(desk.parseEnquiry({...form,emailConsent:true,email:''}),null);
assert.equal(desk.parseEnquiry({...form,method:'Email',email:'test@example.com',emailConsent:false}),null);
assert.equal(desk.parseEnquiry({...form,method:'Email',email:'test@example.com',emailConsent:true}).emailPermission,'Permission given');
assert.equal(desk.parseEnquiry({...form,email:'test@example.com',emailConsent:'true'}).emailConsent,false);
const emailForm={...form,requestId:'0a2a9cc3-46ed-415d-8ce3-7070cc2d49fd',email:'email@example.com',emailConsent:true,method:'Email',currentCover:"Don't have but considering"};
assert.equal((await intake(emailForm)).status,201);
const emailed=(await(await request(['api','workspace'])).json()).leads.find(lead=>lead.id===emailForm.requestId);
assert.equal(emailed.email,'email@example.com');
assert.equal(emailed.emailPermission,'Permission given');
assert.equal(emailed.enquiry.emailConsent,true);
const cleared=await request(['api','leads',emailed.id],'PUT',{...emailed,email:'',emailConsent:false,method:'Phone'});
assert.equal(cleared.status,200);
const afterClear=(await(await request(['api','workspace'])).json()).leads.find(lead=>lead.id===emailed.id);
assert.equal(afterClear.email,'');
assert.equal(afterClear.emailPermission,'Permission not given');
const longLegacy=desk.normalizeLead({notes:'a'.repeat(5000),verifiedNotes:'b'.repeat(5000),unverifiedNotes:'c'.repeat(5000)});
assert.equal(desk.normalizeLead(longLegacy).notes.length,15004);
const originalEnquiry={...captured.enquiry,notes:'Original comment'};
const summary=desk.legacyEnquiryNotes(originalEnquiry,true);
const oldRecord={id:'old-web',name:'Old website record',revision:1,status:'New lead',coverage:[],detailsVersion:2,notes:'Conversation notes\n\n'+summary,enquiry:originalEnquiry};
const migrated=desk.normalizeLead(oldRecord);
assert.equal(migrated.dateOfBirth,form.dateOfBirth);
assert.equal(migrated.incomeAmount,'150000.5');
assert.deepEqual(migrated.contactDays,form.contactDays);
assert.equal(migrated.notes,'Conversation notes\n\nOriginal comment');
assert.deepEqual(desk.normalizeLead(migrated),migrated);
const beforeEmail=desk.normalizeLead({...oldRecord,notes:desk.legacyEnquiryNotes(originalEnquiry,false)});
assert.equal(beforeEmail.notes,'Original comment');
const changedNotes=desk.normalizeLead({...oldRecord,notes:'Date of birth: something I need to discuss'});
assert.equal(changedNotes.notes,'Date of birth: something I need to discuss');
const clearedProfile=desk.normalizeLead({...migrated,dateOfBirth:'',incomeAmount:'',contactDays:[],notes:'Edited notes'});
assert.equal(clearedProfile.dateOfBirth,'');
assert.equal(clearedProfile.incomeAmount,'');
assert.deepEqual(clearedProfile.contactDays,[]);
assert.equal(clearedProfile.notes,'Edited notes');
const kycUpdate=await request(['api','leads',captured.id],'PUT',{...await(await request(['api','workspace'])).json().then(d=>d.leads.find(l=>l.id===captured.id)),dateOfBirth:'1988-11-30',incomeAmount:'250000',company:'Test Co',contactDays:['Monday'],notes:'Spoke on the phone'});
assert.equal(kycUpdate.status,200);
const savedKyc=await kycUpdate.json();
assert.equal(savedKyc.dateOfBirth,'1988-11-30');
assert.equal(savedKyc.company,'Test Co');
assert.deepEqual(savedKyc.contactDays,['Monday']);
assert.equal(savedKyc.notes,'Spoke on the phone');
assert.deepEqual(savedKyc.enquiry,captured.enquiry);
for(const patch of [{dateOfBirth:'2000-02-30'},{dateOfBirth:'2999-01-01'},{incomeAmount:'-1'},{headcount:'1.5'},{contactDays:['Saturday']},{contactWindows:'Morning'}]) {
  assert.equal((await request(['api','leads'],'POST',{name:'Invalid KYC',insurance:'Has insurance',...patch})).status,400);
}
assert.equal((await request(['sign-out'],'POST')).status,303);
assert.equal(desk.didSignOut(),true);
assert.equal((await request(['api','workspace'])).status,401);
// Consultation requests collect contact preferences without inventing income data.
const consultationForm = {...form, requestId:'0a2a9cc3-46ed-415d-8ce3-7070cc2d49fe', entry:'Consultation request',messagingPermission:'Yes'};
for (const key of ['incomeType','incomeAmount','incomeFrequency','timeframe']) delete consultationForm[key];
const consultation = desk.parseEnquiry(consultationForm);
assert.ok(consultation);
assert.equal(consultation.incomeAmount,'');
assert.equal(consultation.incomeType,'');
assert.equal(consultation.timeframe,'');
assert.equal(desk.parseEnquiry({...consultationForm,entry:'Coverage finder'}),null);
for (const patch of [{dateOfBirth:''},{employment:''},{contactDays:[]},{contactDays:['Saturday']},{contactConsent:false},{method:'Email',email:'person@example.com',emailConsent:false},{incomeType:'invalid'}]) {
  assert.equal(desk.parseEnquiry({...consultationForm,...patch}),null);
}
assert.equal((await intake(consultationForm)).status,201);
desk.signIn();
const consultationLead=(await (await request(['api','workspace'])).json()).leads.find(item=>item.id===consultationForm.requestId);
assert.equal(consultationLead.dateOfBirth,consultationForm.dateOfBirth);
assert.equal(consultationLead.incomeAmount,'');
assert.equal(consultationLead.emailConsent,false);
assert.deepEqual(consultationLead.contactDays,consultationForm.contactDays);
for (const employment of ['Employed Full time','Employed Part time']) {
  assert.equal(desk.parseEnquiry({...consultationForm,employment}),null);
  assert.equal(desk.parseEnquiry({...consultationForm,employment,employmentBasis:'Other'}),null);
  for (const employmentBasis of ['Permanent','Temporary/Contract']) {
    assert.equal(desk.parseEnquiry({...consultationForm,employment,employmentBasis}).employmentBasis,employmentBasis);
    const normalized = desk.leadFrom({...consultationLead,employment,employmentBasis});
    assert.equal(normalized.employment,employment);
    assert.equal(normalized.employmentBasis,employmentBasis);
  }
}
assert.equal(desk.parseEnquiry({...consultationForm,employment:'Self-employed',employmentBasis:'Permanent'}).employmentBasis,'');
assert.equal(desk.parseEnquiry({...consultationForm,messagingPermission:undefined}),null);
assert.equal(desk.parseEnquiry({...consultationForm,messagingPermission:'No',method:'WhatsApp'}),null);
assert.equal(desk.parseEnquiry({...consultationForm,messagingPermission:'No',method:'iMessage'}),null);
assert.equal(desk.parseEnquiry({...consultationForm,messagingPermission:'No',method:'Phone'}).messagingPermission,'No');
assert.equal(desk.parseEnquiry({...consultationForm,messagingPermission:'Yes',method:'iMessage'}).messagingPermission,'Yes');
assert.equal(consultationLead.messagingPermission,'Yes');
assert.equal(desk.parseEnquiry({...consultationForm,currentCover:"Don't understand insurance"}).currentCover,"Don't understand insurance");
assert.equal(desk.normalizeLead({...consultationLead,insurance:"Don't understand insurance"}).insurance,"Don't understand insurance");
const employedRequest={...consultationForm,requestId:'0a2a9cc3-46ed-415d-8ce3-7070cc2d49ff',employment:'Employed Part time',employmentBasis:'Temporary/Contract',messagingPermission:'Yes',method:'iMessage',currentCover:"Don't understand insurance"};
assert.equal((await intake(employedRequest)).status,201);
const employedSaved=(await(await request(['api','workspace'])).json()).leads.find(item=>item.id===employedRequest.requestId);
assert.equal(employedSaved.employment,'Employed Part time');
assert.equal(employedSaved.employmentBasis,'Temporary/Contract');
assert.equal(employedSaved.messagingPermission,'Yes');
assert.equal(employedSaved.method,'iMessage');
assert.equal(employedSaved.insurance,"Don't understand insurance");
const employedEdited=await request(['api','leads',employedSaved.id],'PUT',{...employedSaved,notes:'Follow-up arranged'});
assert.equal(employedEdited.status,200);
assert.equal((await employedEdited.json()).employmentBasis,'Temporary/Contract');
console.log('Passed lead desk route tests: access, origin, validation, CRUD, revision, scripts, sign-out, and separate storage.');
