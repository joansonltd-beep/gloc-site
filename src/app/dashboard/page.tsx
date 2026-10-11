import { redirect } from 'next/navigation';
import { authenticated,configured } from '@/lib/dashboard/auth';
import Tracker from './tracker';
export const dynamic='force-dynamic';
export default async function Page(){if(!configured()||!await authenticated())redirect('/dashboard/login');return <Tracker/>}
