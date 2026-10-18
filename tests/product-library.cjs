require('tsx/cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../src/lib/dashboard/product-library.json');
const {libraryMarkdown,libraryCsv,librarySources} = require('../src/lib/dashboard/library-export.ts');
const sourceIds = new Set(data.sources.map(source=>source.id));
const flagIds = new Set(data.flags.map(flag=>flag.id));
assert.equal(sourceIds.size,data.sources.length);
assert.equal(new Set(data.products.map(product=>product.id)).size,data.products.length);
for(const product of data.products){
  for(const id of [...product.sources,...product.documents]) assert(sourceIds.has(id),`${product.id}: missing source ${id}`);
  for(const id of product.flags) assert(flagIds.has(id));
  if(product.status==='Broker reference'){assert.equal(product.currency,'USD');assert(product.flags.includes('V10'));}
}
for(const flag of data.flags) for(const id of flag.sources) assert(sourceIds.has(id));
for(const source of data.sources) assert.equal(new URL(source.url).protocol,'https:');
const md=libraryMarkdown(),csv=libraryCsv(),sources=librarySources();
for(const product of data.products) {assert(md.includes(product.name));assert(csv.includes(product.id));}
for(const flag of data.flags) {assert(md.includes(flag.detail));assert(csv.includes(flag.id));}
assert(md.includes('not a statement of current policy terms'));
assert.equal(csv.split('\r\n').filter(Boolean).length,data.products.length+1);
assert.equal(sources.trim().split('\n').length,data.sources.length);
assert(!/[\u2013\u2014]/.test(md));
const output=process.env.LIBRARY_EXPORT_DIR;
if(output){fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'joanson-product-library-2026-10-16.md'),md);
fs.writeFileSync(path.join(output,'joanson-product-library-2026-10-16.csv'),csv);
fs.writeFileSync(path.join(output,'joanson-source-register-2026-10-16.txt'),sources);
}
console.log(`Passed ${data.products.length} entries, ${data.sources.length} sources, ${data.flags.length} flags, unique identifiers, source integrity and export coverage. Export coverage verified.`);
