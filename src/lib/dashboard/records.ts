import type { Saved } from './model';
export type Store=Record<string,{record:Saved|null;version:number}>;
export function applyRecord(value:Store,input:{kind:string;key:string;version:number},record:Saved|null){
 const id=input.kind+':'+input.key,current=value[id];
 if(current?.record?current.version!==input.version:input.version!==0)return null;
 const version=(current?.version||0)+1;
 return {value:{...value,[id]:{record:record?{...record,version}:null,version}},version};
}
