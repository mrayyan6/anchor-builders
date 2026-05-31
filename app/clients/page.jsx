'use client';
import React from 'react';
import Link from 'next/link';
import { SITE_DATA } from '../../src/data';
import { Reveal, CTABlock } from '../../src/components';

function getClientGridSpanClass(index, total) {
  const remainder = total % 3;
  const isLast = index === total - 1;
  const isSecondLast = index === total - 2;

  if (remainder === 1 && isLast) return 'client-span-full';
  if (remainder === 2 && (isSecondLast || isLast)) return 'client-span-half';
  return '';
}

export default function ClientsPage() {
  const grouped = ['Government', 'Retainer', 'Private'].map(s => ({
    sector: s,
    list: SITE_DATA.CLIENTS.filter(c => c.sector === s),
  }));

  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">— CLIENTS / OUR VALUED CLIENTS</div>
          <div className="title">
            <h1 className="hd-display">A roster built over <i>fifteen years.</i></h1>
            <p className="lede">{SITE_DATA.CLIENTS.length}+ institutions trust Anchor — from Pakistan's federal ministries, research councils and universities to retainer accounts in telecom, banking, and private real estate.</p>
          </div>
        </div>
      </header>

      {/* Client philosophy intro */}
      <section className="section">
        <div className="container-narrow">
          <Reveal>
            <span className="eyebrow"><span className="dot"></span>HOW WE WORK</span>
            <h2 className="hd-2" style={{ marginTop: 16 }}>Our clients are part of the team.</h2>
            <p className="body-lg" style={{ marginTop: 18 }}>Anchor has always embraced our clients and partners as part of our team. Every project is performed with open communication, full transparency, and a shared commitment to outcomes that both sides can be proud of. The trust our clients place in us is something we take seriously — and work every day to deserve.</p>
          </Reveal>
        </div>
      </section>

      {/* Sector-by-sector — detailed client cards (link through to detail pages) */}
      {grouped.map((g, gi) => (
        <section key={g.sector} className={`section ${gi % 2 === 1 ? 'warm' : ''}`}>
          <div className="container-wide">
            <div className="sec-head">
              <div className="sh-l"><span className="eyebrow"><span className="dot"></span>{g.sector.toUpperCase()} · {g.list.length}</span></div>
              <div className="sh-r">
                <h2 className="hd-1">
                  {g.sector === 'Government'
                    ? 'Government & institutional.'
                    : g.sector === 'Retainer'
                    ? 'Long-term retainer clients.'
                    : 'Private developers & brands.'}
                </h2>
              </div>
            </div>
            <div className="clients-grid">
              {g.list.map((c, i) => (
                <Link key={c.id} href={`/clients/${c.id}`} className={`client-card ${getClientGridSpanClass(i, g.list.length)}${gi % 2 === 1 ? ' warm-bg' : ''}`}>
                  <div className="cc-meta"><span>SINCE {c.since}</span><span>{c.projects} {c.projects === 1 ? 'PROJECT' : 'PROJECTS'}</span></div>
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
