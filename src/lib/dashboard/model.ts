export const METRICS = [
 {key:"prospects",label:"Prospects",short:"New prospects"}, {key:"calls",label:"Calls made",short:"Calls"},
 {key:"set",label:"Appointments set",short:"Appts. set"}, {key:"held",label:"Appointments held",short:"Appts. held"},
 {key:"closes",label:"Closes",short:"Closes"}, {key:"applications",label:"Applications submitted",short:"Applications"},
 {key:"premium",label:"Premium written",short:"Premium written"}, {key:"referrals",label:"Referrals",short:"Referrals"},
] as const;
export type Metric = typeof METRICS[number]["key"];
export type Numbers = Record<Metric,number>;
export type Activity = Numbers & {notes:string};
export type Prospect = {name:string;phone:string;product:string;stage:string;nextDate:string;notes:string;added:string};
export type Goals = Numbers & {workingDays:number};
export type Saved = {kind:string;key:string;data:Activity|Prospect|Goals;version:number};
export const STAGES=["New","Contacted","Appointment set","Appointment held","Application submitted","Closed","Not proceeding"];
export const emptyNumbers=():Numbers=>Object.fromEntries(METRICS.map(m=>[m.key,0])) as Numbers;
export function dateValid(value:unknown):value is string {if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+"T12:00:00Z");return !isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;}
export function today(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Jamaica",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}
export function shift(date:string,days:number){const d=new Date(date+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function monday(date:string){const day=new Date(date+"T12:00:00Z").getUTCDay();return shift(date,-((day+6)%7));}
export function sum(records:Saved[],start:string,end:string):Numbers {const totals=emptyNumbers();for(const r of records)if(r.kind==="activity"&&r.key>=start&&r.key<=end){for(const m of METRICS)totals[m.key]+=Number((r.data as Activity)[m.key]||0);}return totals;}
export function progress(value:number,goal:number){return goal>0?Math.min(100,Math.round(value/goal*100)):0;}
export function validateRecord(input:any):{kind:string;key:string;data:any;version:number}|null{
 if(!input||!["activity","prospect","goals"].includes(input.kind)||typeof input.key!=="string"||!Number.isInteger(input.version)||input.version<0||input.version>1000000)return null;
 const d=input.data;if(!d||typeof d!=="object")return null;
 if(input.kind==="activity"||input.kind==="goals"){
  for(const m of METRICS){if(typeof d[m.key]!=="number"||!Number.isFinite(d[m.key])||d[m.key]<0||d[m.key]>1e12||(m.key!=="premium"&&!Number.isInteger(d[m.key])))return null;}
  if(input.kind==="activity"&&(!dateValid(input.key)||typeof d.notes!=="string"||d.notes.length>2000))return null;
  if(input.kind==="goals"&&(input.key!=="weekly"||!Number.isInteger(d.workingDays)||d.workingDays<1||d.workingDays>7))return null;
  const clean={...Object.fromEntries(METRICS.map(m=>[m.key,d[m.key]])),...(input.kind==="activity"?{notes:d.notes}:{workingDays:d.workingDays})};return {...input,data:clean};
 }
 if(!/^[a-f0-9-]{36}$/.test(input.key)||typeof d.name!=="string"||!d.name.trim()||d.name.length>150||!STAGES.includes(d.stage)||!dateValid(d.added)||!['phone','product','nextDate','notes'].every(k=>typeof d[k]==="string"&&d[k].length<=(k==="notes"?2000:150))||(d.nextDate&&!dateValid(d.nextDate)))return null;
 return {...input,data:Object.fromEntries(['name','phone','product','stage','nextDate','notes','added'].map(k=>[k,d[k].trim()]))};
}
