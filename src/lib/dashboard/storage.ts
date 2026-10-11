import 'server-only';
import { get,put,BlobPreconditionFailedError } from '@vercel/blob';
export class Conflict extends Error{}
export async function readDocument<T>(path:string,initial:T){const result=await get(path,{access:'private',useCache:false});if(!result)return {value:initial,etag:undefined};if(result.statusCode!==200||!result.stream)throw Error('Storage unavailable');return {value:await new Response(result.stream).json() as T,etag:result.blob.etag};}
export async function writeDocument(path:string,value:unknown,etag?:string){try{await put(path,JSON.stringify(value),{access:'private',addRandomSuffix:false,contentType:'application/json',cacheControlMaxAge:0,...(etag?{ifMatch:etag}:{allowOverwrite:false})});}catch(e){if(e instanceof BlobPreconditionFailedError)throw new Conflict();throw e;}}
