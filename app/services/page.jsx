'use client';
import React from 'react';
import Link from 'next/link';
import { SITE_DATA } from '../../src/data';
import { Reveal, ImgBox, CTABlock } from '../../src/components';

export default function ServicesPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">— SERVICES / CAPABILITIES</div>
          <div className="title">
            <h1 className="hd-display">Six disciplines.<br/>One contract.</h1>
            <p className="lede">From turnkey civil works to acoustically-engineered theatre sets, Anchor delivers across the construction stack — under a single delivery team.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-wide">
          <div className="svc-grid">
            {SITE_DATA.SERVICES.map((s) => (
              <Reveal key={s.id}>
                <Link href={`/services/${s.id}`} className="svc-card">
                  <ImgBox src={s.hero} ratio="r-169" label={s.name} />
                  <span className="num">— {s.number}</span>
                  <div className="meta-row"><h3>{s.name}</h3><span className="arrow">↗</span></div>
                  <p>{s.description}</p>
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
