import 'server-only';
import { cookies,headers } from 'next/headers';
import { validSession } from './session';
export const COOKIE='bulwark_dashboard_session';
export const configured=()=>Boolean(process.env.DASHBOARD_PASSWORD&&process.env.DASHBOARD_PASSWORD.length>=12&&process.env.DASHBOARD_PASSWORD.length<=256&&(process.env.BLOB_READ_WRITE_TOKEN||process.env.BLOB_STORE_ID));
export async function authenticated(){const h=await headers();const host=h.get('host')||'';const token=(await cookies()).get(COOKIE)?.value;return configured()&&Boolean(token&&validSession(token,process.env.DASHBOARD_PASSWORD!,host));}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');const host=request.headers.get('host');try{return Boolean(origin&&host&&new URL(origin).host===host&&['https:','http:'].includes(new URL(origin).protocol));}catch{return false;}}
