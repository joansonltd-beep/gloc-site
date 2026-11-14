import { authenticated,sameOrigin } from '@/lib/dashboard/auth';
import { Conflict,readDocument,writeDocument } from '@/lib/dashboard/storage';
import { POST as logout } from '@/app/dashboard/logout/route';
import { json,clean,leadFrom,scriptIds } from '@/lib/dashboard/lead-desk/model';
import page from '@/lib/dashboard/lead-desk/index.html';
import css from '@/lib/dashboard/lead-desk/style.css';
import js from '@/lib/dashboard/lead-desk/app.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Lead = ReturnType<typeof leadFrom> & {id:string;revision:number;updatedAt:string};
type Script = {id:string;revision:number;title:string;text:string};
type Desk = {leads:Lead[];scripts:Script[]};
const path = 'dashboard/lead-desk-v1.json';
const empty: Desk = {leads:[],scripts:[]};
const headers = {'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
type Context = {params:Promise<{parts?:string[]}>};

export async function GET(request: Request, {params}:Context) {
  const key = (await params).parts?.join('/') ?? '';
  if (!await authenticated()) return key ? json({error:'Sign in to access your workspace.'},401) : Response.redirect(new URL('/dashboard/login',request.url),307);
  if (key === 'api/workspace') {
    try { return json((await readDocument(path,empty)).value); }
    catch { return json({error:'The workspace could not be loaded.'},503); }
  }
  const asset = key === '' ? [page,'text/html'] : key === 'app.js' ? [js,'text/javascript'] : key === 'style.css' ? [css,'text/css'] : null;
  if (!asset) return json({error:'Page unavailable.'},404);
  return new Response(asset[0],{headers:{...headers,'Content-Type':asset[1]+'; charset=utf-8','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"}});
}

async function mutate(request:Request,{params}:Context) {
  if (!await authenticated()) return json({error:'Sign in to access your workspace.'},401);
  if (!sameOrigin(request)) return json({error:'Request origin could not be verified.'},403);
  const key=(await params).parts?.join('/') ?? '';
  if (key==='sign-out' && request.method==='POST') {
    const result=await logout(request);
    return result.ok ? Response.redirect(new URL('/dashboard/login',request.url),303) : result;
  }
  const match=key.match(/^api\/(leads|scripts)(?:\/([a-z0-9-]{1,50}))?$/);
  if (!match) return json({error:'Page unavailable.'},404);
  const [,resource,id]=match;
  const isLead=resource==='leads';
  const create=isLead && !id && request.method==='POST';
  if (!create && !(id && request.method==='PUT')) return json({error:'Method unavailable.'},405);
  if (!isLead && !scriptIds.includes(id)) return json({error:'Script unavailable.'},404);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error:'Expected JSON.'},415);
  const reader=request.body?.getReader();
  const chunks:Uint8Array[]=[];
  let size=0;
  if (reader) {
    try {
      while(true) {
        const {value,done}=await reader.read();
        if(done) break;
        size+=value.byteLength;
        if(size>40000) { void reader.cancel().catch(()=>{}); return json({error:'This entry is too long.'},413); }
        chunks.push(value);
      }
    } catch {return json({error:'Invalid entry.'},400);}
    finally {reader.releaseLock();}
  }
  let body:Record<string,unknown>;
  try {
    const input=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!input||typeof input!=='object'||Array.isArray(input)) throw Error();
    body=input;
  } catch {return json({error:'Invalid entry.'},400);}
  const revision=body.revision;
  if (!create && (typeof revision!=='number'||!Number.isSafeInteger(revision)||revision<(isLead?1:0))) return json({error:'Refresh the workspace and try again.'},400);
  const lead=isLead?leadFrom(body):null;
  const title=clean(body.title,100), script=clean(body.text,4000);
  if (lead) {
    if (!lead.name) return json({error:'Enter a lead name.'},400);
    if (lead.consent==='Permission documented'&&!lead.consentEvidence) return json({error:'Record how and when permission was given.'},400);
    if (lead.verified.length&&!lead.verificationSource) return json({error:'Record the source and date of the verified details.'},400);
    if (lead.verified.includes('Contact details')&&!lead.confirmedContact) return json({error:'Add confirmed contact details or clear their verification.'},400);
    if (lead.verified.includes('Appointment')&&!lead.appointment) return json({error:'Add appointment details or clear their verification.'},400);
  } else if (!title||!script) return json({error:'Enter a title and script.'},400);
  try {
    const {value,etag}=await readDocument(path,empty);
    const stale=()=>json({error:'This entry changed in another tab. Refresh before trying again.'},409);
    if (lead) {
      if (!create && value.leads.find(item=>item.id===id)?.revision!==revision) return stale();
      const record={...lead,id:create?crypto.randomUUID():id,revision:create?1:Number(revision)+1,updatedAt:new Date().toISOString()};
      await writeDocument(path,{...value,leads:[record,...value.leads.filter(item=>item.id!==record.id)]},etag);
      return json(record,create?201:200);
    }
    if ((value.scripts.find(item=>item.id===id)?.revision??0)!==revision) return stale();
    const record={id,revision:Number(revision)+1,title,text:script};
    await writeDocument(path,{...value,scripts:[record,...value.scripts.filter(item=>item.id!==id)]},etag);
    return json(record);
  } catch (error) {
    if (error instanceof Conflict) return json({error:'The workspace changed. Refresh and try again.'},409);
    return json({error:'The workspace could not be saved.'},503);
  }
}
export const POST=mutate;
export const PUT=mutate;
