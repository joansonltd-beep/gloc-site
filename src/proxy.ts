import { NextRequest, NextResponse } from 'next/server';
export function proxy(request:NextRequest){
 const hostname=(request.headers.get('host')||'').split(':')[0];
 const url=request.nextUrl.clone();
 if(hostname==='dashboard.joansonbjames.com'&&!url.pathname.startsWith('/dashboard')&&!url.pathname.startsWith('/_next')&&url.pathname!=='/favicon.ico'){
  url.pathname='/dashboard'+(url.pathname==='/'?'':url.pathname);return NextResponse.rewrite(url);
 }
 return NextResponse.next();
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
