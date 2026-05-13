'use client';
import React from 'react';
import Link from 'next/link';
import { SITE_DATA } from '../../src/data';
import { CTABlock } from '../../src/components';

export default function ClientsPage() {
  const grouped = ['Government', 'Retainer', 'Private'].map(s => ({
    sector: s,
    list: SITE_DATA.CLIENTS.filter(c => c.sector === s),
  }));
  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">— CLIENTS / TRUSTED BY</div>
          <div className="title">
            <h1 className="hd-display">A roster built over <i>fifteen years.</i></h1>
            <p className="lede">{SITE_DATA.CLIENTS.length}+ institutions trust Anchor — from Pakistan's federal ministries and research councils to retainer accounts in telecom, banking and private real estate.</p>
          </div>
        </div>
      </header>

      {grouped.map((g, gi) => (
        <section key={g.sector} className={`section ${gi % 2 === 1 ? 'warm' : ''}`}>
          <div className="container-wide">
            <div className="sec-head">
              <div className="sh-l"><span className="eyebrow"><span className="dot"></span>{g.sector.toUpperCase()}</span></div>
              <div className="sh-r"><h2 className="hd-1">{g.sector === 'Government' ? 'Public-sector institutions.' : g.sector === 'Retainer' ? 'Long-term retainer clients.' : 'Private developers & brands.'}</h2></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
              {g.list.map(c => (
                <Link key={c.id} href={`/clients/${c.id}`} className={`client-card${gi % 2 === 1 ? ' warm-bg' : ''}`}>
                  <div className="cc-meta"><span>SINCE {c.since}</span><span>{c.projects} PROJECTS</span></div>
                  <span className="cc-arrow">↗</span>
                  <div className="cc-name-wrap">
                    <h3 className="cc-name">{c.name}</h3>
                    <p className="cc-full">{c.fullName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CTABlock />
    </main>
  );
}
