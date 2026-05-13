'use client';
import React from 'react';
import { SITE_DATA } from '../../src/data';
import { Reveal, ImgBox, CTABlock } from '../../src/components';

export default function AboutPage() {
  const milestones = [
    { yr: '2010', t: 'Anchor is founded', d: 'Anchor Associates & Builders is established in Islamabad with a focus on civil and MEP construction.' },
    { yr: '2014', t: 'First retainer client — PTCL', d: 'A multi-year retainer with Pakistan Telecommunication Company opens consistent commercial work.' },
    { yr: '2016', t: 'PARC & NARC partnership begins', d: 'Anchor enters the agricultural research segment with cold storage, glass houses and photoperiod chambers.' },
    { yr: '2019', t: 'PEC Category C-2', d: 'Pakistan Engineering Council registration upgraded to Category C-2, expanding eligibility for major government tenders.' },
    { yr: '2022', t: 'Specialty studios division', d: 'Soundproof studios, board rooms and theatre set design grow into a dedicated specialty practice.' },
    { yr: '2024', t: '140th project delivered', d: 'Alkaram University Administration Block, AZRI Lab Block at Umerkot, and the AIOU Call Center bring the project total past 140.' },
  ];
  const team = [
    { n: 'Founder & Principal', src: SITE_DATA.IMG.teamA },
    { n: 'Director of Operations', src: SITE_DATA.IMG.teamB },
    { n: 'Head of MEP', src: SITE_DATA.IMG.teamC },
    { n: 'Head of HSE', src: SITE_DATA.IMG.teamD },
  ];
  return (
    <main className="page">
      <header className="page-header dark">
        <div className="container-wide">
          <div className="crumb">— ABOUT / OUR STUDIO</div>
          <div className="title">
            <h1 className="hd-display" style={{ color: 'var(--on-dark)' }}>A firm built on <i style={{ color: '#d9c8a8' }}>integrity,</i> safety and craft.</h1>
            <p className="lede" style={{ color: 'rgba(236,232,223,0.7)' }}>Established in 2010 in Islamabad and operating across Pakistan, Anchor delivers end-to-end construction and project management across six disciplines.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80 }}>
            <Reveal mode="image"><ImgBox src={SITE_DATA.IMG.archE} ratio="r-tall" /></Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36, paddingTop: 40 }}>
              <Reveal>
                <span className="eyebrow"><span className="dot"></span>VISION</span>
                <h2 className="hd-2" style={{ marginTop: 14 }}>To be a leading force in Pakistan's construction industry — recognised for innovation, transparency and environmental stewardship.</h2>
              </Reveal>
              <Reveal delay={120}>
                <span className="eyebrow"><span className="dot"></span>MISSION</span>
                <h2 className="hd-2" style={{ marginTop: 14 }}>To construct exceptional, sustainable and innovative structures that strengthen the foundation of our communities.</h2>
                <p className="body-lg" style={{ marginTop: 16 }}>We are committed to the highest standards of quality, safety and client satisfaction — ensuring every project reflects our integrity and craftsmanship.</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section warm">
        <div className="container">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>MILESTONES</span></div>
            <div className="sh-r"><h2 className="hd-1">A decade and a half, in chapters.</h2></div>
          </div>
          <div>
            {milestones.map((m, i) => (
              <Reveal key={i} className="timeline">
                <div className="yr">{m.yr}</div>
                <div className="ev">
                  <div className="ev-title">{m.t}</div>
                  <p>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section dark">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>VALUES</span></div>
            <div className="sh-r"><h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>Quality assurance &amp;<br/>safety standards.</h2></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 60 }}>
            <Reveal>
              <div className="eyebrow dark">QUALITY</div>
              <h3 className="hd-3" style={{ marginTop: 12, color: 'var(--on-dark)' }}>Built into every stage.</h3>
              <p className="body-lg" style={{ marginTop: 12 }}>From design and material selection to execution and final inspection, we follow stringent quality control processes — ensuring durability, precision and compliance with international standards.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="eyebrow dark">SAFETY · HSE</div>
              <h3 className="hd-3" style={{ marginTop: 12, color: 'var(--on-dark)' }}>The heart of every site.</h3>
              <p className="body-lg" style={{ marginTop: 12 }}>Our teams adhere to strict HSE (Health, Safety &amp; Environment) protocols to ensure safe, efficient and compliant project execution — across every active site, in every season.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>LEADERSHIP</span></div>
            <div className="sh-r"><h2 className="hd-1">The people steering every project.</h2></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {team.map((t, i) => (
              <Reveal key={i}>
                <ImgBox src={t.src} ratio="r-tall" />
                <div style={{ marginTop: 14, fontFamily: 'var(--serif)', fontSize: 22 }}>{t.n}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
