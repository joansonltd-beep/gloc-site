import { redirect } from 'next/navigation';
import { authenticated } from '@/lib/dashboard/auth';
export const dynamic = 'force-dynamic';
export default async function Page() { redirect(await authenticated() ? '/dashboard/desk' : '/dashboard/login'); }
