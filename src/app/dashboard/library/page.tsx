import { redirect } from 'next/navigation';
import { authenticated } from '@/lib/dashboard/auth';
import ProductLibrary from './product-library';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private Product Library' };

export default async function Page() {
  if (!await authenticated()) redirect('/dashboard/login');
  return <ProductLibrary />;
}
