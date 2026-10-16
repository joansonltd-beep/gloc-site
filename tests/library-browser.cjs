require('tsx/cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {issueSession}=require('../src/lib/dashboard/session.ts');
const {libraryMarkdown,libraryCsv}=require('../src/lib/dashboard/library-export.ts');
const base='http://localhost:51477';
(async()=>{
  const response=await fetch(base+'/dashboard/library',{redirect:'manual'});assert.equal(response.status,307);assert.equal(response.headers.get('location'),'/dashboard/login');
  for(const format of ['md','csv','txt']) {const r=await fetch(base+'/dashboard/library/export?format='+format);assert.equal(r.status,401);assert(r.headers.get('cache-control').includes('no-store'));}
  const token=issueSession('local-library-validation-2026','localhost:51477');
  const headers={cookie:'bulwark_dashboard_session='+token};
  const md=await fetch(base+'/dashboard/library/export',{headers});assert.equal(md.status,200);assert.equal(await md.text(),libraryMarkdown());assert(md.headers.get('content-disposition').endsWith('.md"'));
  const csv=await fetch(base+'/dashboard/library/export?format=csv',{headers});assert.equal(csv.status,200);assert.equal(await csv.text(),libraryCsv().replace(/^\uFEFF/,''));
  assert.equal((await fetch(base+'/dashboard/library/export?format=bad',{headers})).status,400);
  const browser=await chromium.launch({headless:true,...(process.env.TEST_BROWSER_CHANNEL ? {channel:process.env.TEST_BROWSER_CHANNEL} : {})});
  try {
    const context=await browser.newContext({viewport:{width:1440,height:1000}});
    await context.addCookies([{name:'bulwark_dashboard_session',value:token,url:base,httpOnly:true,sameSite:'Strict'}]);
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/dashboard/library');await page.getByRole('heading',{name:'Products, with the evidence.'}).waitFor();
    assert.equal(await page.locator('.library-card').count(),105);
    await page.getByLabel('Search',{exact:true}).fill('Family AIDE');assert.equal(await page.locator('.library-card').count(),1);await page.getByText('V02: Family AIDE recurrence conflict',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Clear filters',exact:true}).click();
    await page.getByLabel('Carrier',{exact:true}).selectOption('Guardian Life');assert.equal(await page.locator('.library-card').count(),32);
    await page.getByLabel('Status',{exact:true}).selectOption('Service only');assert.equal(await page.locator('.library-card').count(),9);
    await page.getByRole('button',{name:'Clear filters',exact:true}).click();
    await page.getByLabel('Status',{exact:true}).selectOption('Broker reference');assert.equal(await page.locator('.library-card').count(),10);assert((await page.locator('.library-card').first().innerText()).includes('V10'));
    await page.getByRole('button',{name:'Clear filters',exact:true}).click();
    await page.getByRole('button',{name:'Verification register',exact:true}).click();assert.equal(await page.locator('.library-card').count(),11);
    await page.getByRole('button',{name:'Products',exact:true}).click();
    await page.getByLabel('Search',{exact:true}).fill('nonesuch-xyz');assert.equal(await page.locator('.library-card').count(),0);await page.getByText('No entries match. Clear a filter to widen your search.').waitFor();
    await page.getByRole('button',{name:'Clear filters',exact:true}).click();
    const downloadEvent=page.waitForEvent('download');await page.getByRole('link',{name:'Download research (.md)',exact:true}).click();const download=await downloadEvent;assert.equal(download.suggestedFilename(),'bulwark-product-library-2026-10-16.md');
    const output=process.env.LIBRARY_EXPORT_DIR || path.resolve('test-results');await page.screenshot({path:path.join(output,'product-library-desktop.png')});
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'product-library-mobile.png')});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
    assert.equal(errors.length,0,errors.join('\n'));
    console.log('Passed unauthenticated page/export protection, authenticated download parity, invalid formats, 105 rendered entries, search, carrier/status filters, legacy/offshore separation, 11 issue cards, empty state, download interaction, mobile overflow and browser errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
