import { cookies } from 'next/headers';
import { COOKIE,sameOrigin } from '@/lib/dashboard/auth';
export async function POST(request:Request){if(!sameOrigin(request))return Response.json({error:'Invalid request origin.'},{status:403});(await cookies()).delete(COOKIE);return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});}
