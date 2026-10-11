import { authenticated,configured,sameOrigin } from '@/lib/dashboard/auth';
import { validateRecord,type Saved } from '@/lib/dashboard/model';
import { applyRecord,type Store } from '@/lib/dashboard/records';
import { Conflict,readDocument,writeDocument } from '@/lib/dashboard/storage';
export const dynamic='force-dynamic';export const runtime='nodejs';
const PATH='dashboard/records.json';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex'}});
async function gate(request:Request,write=false){if(!configured())return reply({error:'Dashboard setup is not complete.'},503);if(!await authenticated())return reply({error:'Your session ended. Sign in again.'},401);if(write&&!sameOrigin(request))return reply({error:'Invalid request origin.'},403);}
export async function GET(request:Request){const blocked=await gate(request);if(blocked)return blocked;try{const {value}=await readDocument<Store>(PATH,{});return reply({records:Object.values(value).flatMap(v=>v.record?[v.record]:[])});}catch{return reply({error:'Unable to load saved records. Try again.'},503);}}
async function change(request:Request,deleting:boolean){const blocked=await gate(request,true);if(blocked)return blocked;
 try{const body=await request.text();if(body.length>16000)return reply({error:'Record is too large.'},413);const input=JSON.parse(body);
 const record=deleting?null:validateRecord(input);
 if(deleting?(!['activity','prospect'].includes(input.kind)||typeof input.key!=='string'||input.key.length>100||!Number.isInteger(input.version)||input.version<1):!record)return reply({error:'Check your entries. Counts must be whole numbers and dates valid.'},400);
 const {value,etag}=await readDocument<Store>(PATH,{});const changed=applyRecord(value,input,record as Saved|null);
 if(!changed)return reply({error:'This record changed in another tab. Refresh and try again.'},409);
 const {version}=changed;
 await writeDocument(PATH,changed.value,etag);return reply({ok:true,version});
 }catch(e){if(e instanceof Conflict)return reply({error:'Records changed in another tab. Refresh and try again.'},409);if(e instanceof SyntaxError)return reply({error:'Invalid record.'},400);return reply({error:'Unable to save. Your changes have not been confirmed.'},503);}}
export const PUT=(r:Request)=>change(r,false);export const DELETE=(r:Request)=>change(r,true);
