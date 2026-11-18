import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const catalogue=JSON.parse(readFileSync('src/lib/public-insurers.json','utf8'));
const guides=JSON.parse(readFileSync('src/lib/insurance-guides.json','utf8'));
assert.deepEqual(catalogue.carriers.map(c=>c.name),['Guardian Life','JN Life','Sagicor Life']);
assert.equal(new Set(catalogue.products.map(p=>p.id)).size,catalogue.products.length);
for(const product of catalogue.products){
 assert(catalogue.carriers.some(c=>c.name===product.carrier));
 assert(product.topics.length && product.topics.every(topic=>guides[topic]));
 assert.match(product.source,/^https:\/\//);
 assert(!/creditor|government-sponsored|cayman|mutual life plans/i.test(product.name));
 for(const document of product.documents){
   assert(document.kind && document.title);
   assert(!/brochure/i.test(document.kind) || /brochure|leaflet/i.test(document.title));
   if(document.file.startsWith('/')){
     const file='public'+document.file;assert(existsSync(file),file);
     assert.equal(readFileSync(file).subarray(0,5).toString(),'%PDF-');
   }
 }
}
assert(!catalogue.products.some(p=>p.carrier==='JN Life' && p.topics.includes('health')));
for(const [slug,guide] of Object.entries(guides)){
 assert(guide.intro && guide.sections.length>=2 && guide.checks.length>=4 && guide.sources.length);
 assert(guide.sections.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length>=150,slug);
 assert(!/[\u2013\u2014]/.test(JSON.stringify(guide)),slug);
 assert(catalogue.products.some(p=>p.topics.includes(slug)),slug);
}
console.log('Public insurance content checks passed: complete guides, correct carriers and topics, real PDF files and accurate document labels.');
