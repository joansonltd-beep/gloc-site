import library from './product-library.json';

const sourceMap = new Map(library.sources.map(source => [source.id, source]));
const flagMap = new Map(library.flags.map(flag => [flag.id, flag]));
const link = (id: string) => {
  const source = sourceMap.get(id);
  return source ? `[${source.title}](${source.url})` : id;
};
const cell = (value: string) => value.replaceAll('|', '\\|').replaceAll('\n', ' ');

export function libraryMarkdown() {
  const lines = [
    '# Bulwark Insurance Product Research Library',
    '',
    `Research checked: ${library.checked}. Market: Jamaica.`,
    '',
    'This is a source-backed research index, not a statement of current policy terms or authority to sell every entry. Entries include policy families, group arrangements and offshore references, not just separately purchasable policies.',
    '',
    '## Evidence limits',
    '',
    ...library.limitations.map(text => `- ${text}`),
    '',
    'Use the linked original documents as additional NotebookLM sources. A webpage export, newsletter, application and brochure are different document types. A recent search or URL timestamp does not establish a recent policy edition.',
    '',
    '## Catalogue',
    '',
    '| Carrier | Entry | Category | Published status | Currency | Verification | Sources and documents |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const product of library.products) {
    lines.push('| ' + [product.carrier, product.name, product.category, product.status, product.currency,
      product.flags.length ? product.flags.join(', ') : 'Current edition and availability still require confirmation',
      [...new Set([...product.sources, ...product.documents])].map(link).join('; ')
    ].map(cell).join(' | ') + ' |');
  }
  lines.push('', '## Verification register', '');
  for (const flag of library.flags) {
    lines.push(`### ${flag.id}: ${flag.title}`, '', flag.detail, '', `Required action: ${flag.action}`, '', `Evidence: ${flag.sources.map(link).join('; ')}`, '');
  }
  lines.push('## Source register', '');
  for (const source of library.sources) {
    lines.push(`- ${source.id}: ${link(source.id)}. Type: ${source.kind}. Publication or edition: ${source.date}. Checked: ${source.checked}.`);
  }
  lines.push('', '## Missing information', '',
    '- Obtain current new-business and withdrawn-product lists from each carrier.',
    '- Obtain dated brochures, benefit schedules, riders and policy wording for every entry.',
    '- Resolve every verification flag in writing before using disputed figures in quotations.',
    '- Confirm agency and scheme distribution eligibility. International broker names and appointments remain pending.',
    '', '## NotebookLM research guidance', '',
    'Keep factual product descriptions separate from unresolved terms. Cite the exact source for each answer. If sources conflict, identify both and retain the verification flag. Do not infer that an unavailable brochure means a product is withdrawn. Do not use historical media prices as current quotations.', '');
  return lines.join('\n');
}

export function libraryCsv() {
  const quote = (value: string) => '"' + (/^[=+@\-\t\r]/.test(value) ? "'" + value : value).replaceAll('"', '""') + '"';
  const rows = [['id', 'carrier', 'product', 'category', 'status', 'currency', 'checked', 'verification_ids', 'verification_details', 'source_urls', 'document_urls', 'limitations']];
  for (const product of library.products) rows.push([
    product.id, product.carrier, product.name, product.category, product.status, product.currency, library.checked,
    product.flags.join('; '), product.flags.map(id => flagMap.get(id)?.detail || id).join(' | '),
    product.sources.map(id => sourceMap.get(id)?.url || id).join(' | '),
    product.documents.map(id => sourceMap.get(id)?.url || id).join(' | '), library.limitations.join(' '),
  ]);
  return '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n') + '\r\n';
}

export function librarySources() {
  return library.sources.map(source => `${source.id}\t${source.title}\t${source.kind}\t${source.date}\t${source.url}`).join('\n') + '\n';
}
