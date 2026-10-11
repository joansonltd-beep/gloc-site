import Login from './login';
import { authenticated,configured } from '@/lib/dashboard/auth';
import { redirect } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Page(){if(await authenticated())redirect('/dashboard');return <Login ready={configured()}/>}
