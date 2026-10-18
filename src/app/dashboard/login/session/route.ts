import { readBoundedText,BodyTooLarge } from '@/lib/requestBody';
import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { COOKIE,configured,sameOrigin } from '@/lib/dashboard/auth';
import { issueSession,passwordMatches } from '@/lib/dashboard/session';
import { readDocument,writeDocument,Conflict } from '@/lib/dashboard/storage';
export const runtime='nodejs';export const dynamic='force-dynamic';
const reply=(error:string,status:number)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){if(!configured())return reply('Private setup is not complete.',503);if(!sameOrigin(request))return reply('Invalid request origin.',403);
 try{const body=await readBoundedText(request,4096);if(body.length>1000)return reply('Invalid password.',400);const input=JSON.parse(body);if(typeof input.password!=='string'||input.password.length>256)return reply('Invalid password.',400);
 const ip=(request.headers.get('x-forwarded-for')||'local').split(',')[0].trim();const hash=createHash('sha256').update(ip).digest('hex');const path='dashboard/login-attempts/'+hash+'.json';
 let allowed=false;
 for(let retry=0;retry<3;retry++){const {value,etag}=await readDocument(path,{count:0,until:0});const now=Date.now();const bucket=value.until>now?value:{count:0,until:now+15*60*1000};if(bucket.count>=10)return reply('Too many sign-in attempts. Try again in 15 minutes.',429);try{await writeDocument(path,{...bucket,count:bucket.count+1},etag);allowed=true;break;}catch(e){if(!(e instanceof Conflict))throw e;}}
 if(!allowed)return reply('Sign-in is busy. Try again shortly.',429);
 if(!passwordMatches(input.password,process.env.DASHBOARD_PASSWORD!))return reply('The password was not recognised.',401);
 (await cookies()).set(COOKIE,issueSession(process.env.DASHBOARD_PASSWORD!,request.headers.get('host')||''),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*60*60});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch(e){if(e instanceof BodyTooLarge)return reply('Invalid password.',400);return reply('Sign-in is unavailable. Try again shortly.',503);}}
