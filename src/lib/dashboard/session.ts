import { createHash,createHmac,randomBytes,timingSafeEqual,scryptSync } from 'node:crypto';
const digest=(v:string)=>createHash('sha256').update(v).digest();
export function passwordMatches(input:string,password:string){return timingSafeEqual(digest(input),digest(password));}
export function issueSession(password:string,origin:string,now=Date.now()){
 const payload=Buffer.from(JSON.stringify({exp:now+8*60*60*1000,origin,nonce:randomBytes(24).toString('hex')})).toString('base64url');
 return payload+'.'+createHmac('sha256',scryptSync(password,'joanson-dashboard-session-v1',32)).update(payload).digest('base64url');
}
export function validSession(token:string,password:string,origin:string,now=Date.now()){
 try{const [payload,sig,extra]=token.split('.');if(!payload||!sig||extra)return false;
 const expected=createHmac('sha256',scryptSync(password,'joanson-dashboard-session-v1',32)).update(payload).digest();const received=Buffer.from(sig,'base64url');
 if(received.length!==expected.length||!timingSafeEqual(received,expected))return false;
 const value=JSON.parse(Buffer.from(payload,'base64url').toString());return value.origin===origin&&typeof value.exp==='number'&&value.exp>now&&value.exp<=now+8*60*60*1000;
 }catch{return false;}
}
