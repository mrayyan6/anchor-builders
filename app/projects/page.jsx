'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SITE_DATA } from '../../src/data';
import { Reveal, ImgBox, CTABlock } from '../../src/components';

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const initialCat = searchParams?.get('cat') || 'all';
  const [cat, setCat] = useState(initialCat);

  // Keep state in sync if the user navigates with ?cat= changes
  useEffect(() => { setCat(initialCat); }, [initialCat]);

  const filtered = useMemo(
    () => cat === 'all' ? SITE_DATA.PROJECTS : SITE_DATA.PROJECTS.filter(p => p.categoryId === cat),
    [cat]
  );
  const counts = useMemo(() => {
    const c = { all: SITE_DATA.PROJECTS.length };
    SITE_DATA.CATEGORIES.forEach(x => { c[x.id] = SITE_DATA.PROJECTS.filter(p => p.categoryId === x.id).length; });
    return c;
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">— PROJECTS / SELECTED WORK</div>
          <div className="title">
            <h1 className="hd-display">A portfolio in <i>concrete,</i> steel and glass.</h1>
            <p className="lede">{SITE_DATA.PROJECTS.length} projects across Pakistan — for government bodies, retainer clients and private developers. Filter by category, or browse the full list.</p>
          </div>
        </div>
      </header>

      <section style={{ padding: '0 0 32px' }}>
        <div className="container-wide">
          <div className="filter-bar">
            <button className={cat === 'all' ? 'active' : ''} onClick={() => setCat('all')}>All<span className="count">{counts.all}</span></button>
            {SITE_DATA.CATEGORIES.map(c => (
              <button key={c.id} className={cat === c.id ? 'active' : ''} onClick={() => setCat(c.id)}>{c.name}<span className="count">{counts[c.id]}</span></button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, gridAutoFlow: 'dense' }}>
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <Link
                  href={`/projects/${p.id}?from=cat&id=${p.categoryId}`}
                  className="proj-card"
                  data-cursor="view"
                  data-cursor-label="View"
                >
                  <ImgBox src={p.hero} ratio={i % 5 === 0 ? 'r-tall' : 'r-43'} label={p.name} />
                  <div className="cat">{SITE_DATA.byId(SITE_DATA.CATEGORIES, p.categoryId)?.name}</div>
                  <div className="meta">
                    <div className="nm">{p.name}</div>
                    <div className="loc">{p.location} · {p.year}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
