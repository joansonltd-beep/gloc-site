import { authenticated } from '@/lib/dashboard/auth';
import { libraryMarkdown, libraryCsv, librarySources } from '@/lib/dashboard/library-export';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
  if (!await authenticated()) return Response.json({ error: 'Sign in to download the library.' }, { status: 401, headers });
  const format = new URL(request.url).searchParams.get('format') || 'md';
  if (!['md', 'csv', 'txt'].includes(format)) return Response.json({ error: 'Choose md, csv or txt.' }, { status: 400, headers });
  const content = format === 'csv' ? libraryCsv() : format === 'txt' ? librarySources() : libraryMarkdown();
  return new Response(content, { headers: { ...headers,
    'Content-Type': format === 'csv' ? 'text/csv; charset=utf-8' : 'text/plain; charset=utf-8',
    'Content-Disposition': `attachment; filename="bulwark-product-library-2026-10-16.${format}"`,
  } });
}
