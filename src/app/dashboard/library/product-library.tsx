'use client';

import { useState } from 'react';
import library from '@/lib/dashboard/product-library.json';
import './library.css';

const sources = new Map(library.sources.map(source => [source.id, source]));
const flags = new Map(library.flags.map(flag => [flag.id, flag]));
const carriers = [...new Set(library.products.map(product => product.carrier))];
const categories = [...new Set(library.products.map(product => product.category))].sort();

function SourceLink({ id }: { id: string }) {
  const source = sources.get(id);
  return source ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="library-link-type">{source.kind}</span></a> : null;
}

export default function ProductLibrary() {
  const [query, setQuery] = useState('');
  const [carrier, setCarrier] = useState('All carriers');
  const [category, setCategory] = useState('All categories');
  const [status, setStatus] = useState('All statuses');
  const [view, setView] = useState('Products');
  const filtered = library.products.filter(product =>
    (carrier === 'All carriers' || product.carrier === carrier) &&
    (category === 'All categories' || product.category === category) &&
    (status === 'All statuses' || (status === 'Flagged' ? product.flags.length > 0 : status === 'Documents located' ? product.documents.length > 0 : product.status === status)) &&
    `${product.name} ${product.carrier} ${product.category} ${product.status} ${product.flags.map(id => flags.get(id)?.detail).join(' ')}`.toLowerCase().includes(query.toLowerCase())
  );
  const filteredFlags = library.flags.filter(flag => (carrier === 'All carriers' || library.products.some(product => product.carrier === carrier && product.flags.includes(flag.id))) && `${flag.id} ${flag.title} ${flag.detail}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="workspace library-workspace">
    <aside><a href="/dashboard" className="brand"><span className="brand-symbol">J.</span><span>Joanson<small>ACTIVITY WORKSPACE</small></span></a><div className="private-pill">● Private workspace</div>
      <nav aria-label="Workspace"><a className="nav-item" href="/dashboard">Activity tracker</a><a className="nav-item active" aria-current="page" href="/dashboard/library">Product library</a></nav>
      <div className="sidebar-note"><strong>Know the source.</strong><p>Review carrier documents and keep unresolved terms in view.</p></div><div className="sidebar-foot">Joanson Baptiste James<br />Jamaica</div>
    </aside>
    <main><header className="topbar"><span>YOUR PRIVATE REFERENCE LIBRARY</span><a className="quiet" href="/dashboard">Back to activity tracker</a></header>
      <div className="main-content"><div className="page-head"><div><p className="eyebrow">JOANSON / PRODUCT LIBRARY</p><h1>Products, with the evidence.</h1><p>Carrier references, original documents and a clear record of what still needs confirmation.</p></div></div>
        <div className="library-summary"><div><strong>{library.products.length}</strong><span>Catalogue entries</span></div><div><strong>{library.sources.length}</strong><span>Sources indexed</span></div><div><strong>{library.flags.length}</strong><span>Verification issues</span></div><div><strong>16 Oct 2026</strong><span>Research checked</span></div></div>
        <section className="library-caution" aria-label="Research limitations"><strong>Reference material, with verification still required.</strong><p>Carrier listing is evidence of a published product, not confirmation of current availability, policy terms or your authority to sell every variant. Entries include legacy policy families and group arrangements. International partnerships remain pending.</p><details><summary>How to read this library</summary><ul>{library.limitations.map(item => <li key={item}>{item}</li>)}</ul></details></section>
        <section className="panel library-export"><div><h2>Take the research to NotebookLM</h2><p>Download the source-backed index, then add the linked original documents as separate sources. Conflicts stay flagged in every export.</p></div><div className="library-downloads"><a className="primary" href="/dashboard/library/export?format=md">Download research (.md)</a><a className="quiet" href="/dashboard/library/export?format=csv">Product table (.csv)</a><a className="quiet" href="/dashboard/library/export?format=txt">Source list (.txt)</a></div></section>
        <div className="library-tabs" aria-label="Library view">{['Products','Verification register','Sources'].map(label => <button key={label} aria-pressed={view === label} onClick={() => { setView(label); setQuery(''); }} className={view === label ? 'selected' : ''}>{label}</button>)}</div>
        <div className="library-filters"><label>Search<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Product, carrier or issue" /></label>{view !== 'Sources' && <label>Carrier<select aria-label="Carrier" value={carrier} onChange={event => setCarrier(event.target.value)}>{['All carriers',...carriers].map(item => <option key={item}>{item}</option>)}</select></label>}{view === 'Products' && <><label>Category<select aria-label="Category" value={category} onChange={event => setCategory(event.target.value)}>{['All categories',...categories].map(item => <option key={item}>{item}</option>)}</select></label><label>Status<select aria-label="Status" value={status} onChange={event => setStatus(event.target.value)}>{['All statuses','Flagged','Documents located','Carrier listed','Restricted scheme','Service only','Historical reference','Broker reference'].map(item => <option key={item}>{item}</option>)}</select></label></>}<button className="quiet" onClick={() => {setQuery('');setCarrier('All carriers');setCategory('All categories');setStatus('All statuses');}}>Clear filters</button></div>
        {view === 'Products' && <><p className="fine" role="status">{filtered.length} catalogue entries shown. Counts are not the number of separately purchasable policies.</p><div className="library-grid">{filtered.map(product => <article className="panel library-card" key={product.id}><div className="library-card-label"><span>{product.carrier}</span><span className={product.flags.length ? 'library-badge flagged' : 'library-badge'}>{product.flags.length ? 'Verification flagged' : product.status}</span></div><h2>{product.name}</h2><p className="library-category">{product.category} · {product.currency}</p><p>{product.summary}</p>{product.flags.map(id => <div className="library-issue" key={id}><strong>{id}: {flags.get(id)?.title}</strong><p>{flags.get(id)?.detail}</p></div>)}<details><summary>Review sources and documents ({new Set([...product.sources,...product.documents]).size})</summary><div className="library-source-links">{[...new Set([...product.sources,...product.documents])].map(id => <SourceLink key={id} id={id} />)}</div>{!product.documents.length && <p className="fine">No product-specific downloadable document located in this research.</p>}<p className="fine">Document edition and current availability require confirmation. Newsletters, forms and webpage exports are labelled separately from brochures.</p></details></article>)}</div>{!filtered.length && <div className="empty">No entries match. Clear a filter to widen your search.</div>}</>}
        {view === 'Verification register' && <><p className="fine" role="status">{filteredFlags.length} verification issues shown. Conflicting terms are not resolved by choosing the newest search result.</p><div className="library-grid">{filteredFlags.map(flag => <article className="panel library-card" key={flag.id}><span className="library-badge flagged">{flag.id} · Needs confirmation</span><h2>{flag.title}</h2><p>{flag.detail}</p><p><strong>Next step:</strong> {flag.action}</p><div className="library-source-links">{flag.sources.map(id => <SourceLink key={id} id={id} />)}</div></article>)}</div>{!filteredFlags.length && <div className="empty">No verification issues match these filters.</div>}</>}
        {view === 'Sources' && <section className="panel"><p className="fine">Publication dates and document editions are distinct from the research check date. Some older documents remain useful only as historical evidence.</p><div className="library-source-register">{library.sources.filter(source => `${source.title} ${source.kind} ${source.date}`.toLowerCase().includes(query.toLowerCase())).map(source => <article key={source.id}><SourceLink id={source.id} /><p>Publication or edition: {source.date}. Checked: {source.checked}.</p></article>)}</div></section>}
        <footer className="workspace-footer">Password protected · Public-source research index<span>Policy wording and current schedules govern benefits</span></footer>
      </div>
    </main>
  </div>;
}
