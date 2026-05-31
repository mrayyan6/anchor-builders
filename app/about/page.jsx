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
    { yr: '2024', t: '150th project delivered', d: 'Alkaram University Administration Block, AZRI Lab Block at Umerkot, and the AIOU Call Center bring the project total past 150.' },
  ];
  const team = [
    { n: 'Founder & Principal', src: SITE_DATA.IMG.teamA },
    { n: 'Director of Operations', src: SITE_DATA.IMG.teamB },
    { n: 'Head of MEP', src: SITE_DATA.IMG.teamC },
    { n: 'Head of HSE', src: SITE_DATA.IMG.teamD },
  ];

  // Two cohorts of differentiators for a balanced grid on About
  const diff = SITE_DATA.DIFFERENTIATORS;

  return (
    <main className="page">
      <header className="page-header dark">
        <div className="container-wide">
          <div className="crumb">— ABOUT / OUR STORY</div>
          <div className="title">
            <h1 className="hd-display" style={{ color: 'var(--on-dark)' }}>A firm built on <i style={{ color: '#d9c8a8' }}>integrity,</i> standards and craft.</h1>
            <p className="lede" style={{ color: 'rgba(236,232,223,0.7)' }}>Established in Islamabad in 2010, Anchor has grown steadily under experienced leadership — building a reputation earned project by project across government, institutional, and commercial sectors.</p>
          </div>
        </div>
      </header>

      {/* Our Story */}
      <section className="section">
        <div className="container-wide">
          <div className="about-story-grid">
            <Reveal mode="image"><ImgBox src={SITE_DATA.IMG.archE} ratio="r-tall" /></Reveal>
            <div className="about-story-col">

              <Reveal>
                <span className="eyebrow"><span className="dot"></span>OUR STORY</span>
                <h2 className="hd-2" style={{ marginTop: 14 }}>For fifteen years, a cornerstone of quality and reliability in Pakistan's construction industry.</h2>
                <p className="body-lg" style={{ marginTop: 16 }}>Anchor Associates & Builders was established in Islamabad in 2010. Since then, the firm has grown steadily under experienced leadership — building a reputation earned project by project across government, institutional, and commercial sectors. We are a Category C-2 PEC registered firm headquartered in Islamabad, delivering services nationwide.</p>
              </Reveal>
              <Reveal delay={120}>
                <span className="eyebrow"><span className="dot"></span>OUR MISSION</span>
                <h2 className="hd-2" style={{ marginTop: 14 }}>We are not just building structures. We are building trust.</h2>
                <p className="body-lg" style={{ marginTop: 16 }}>For fifteen years, we have consistently delivered the best standard of construction service to the clients who place their confidence in us — and we intend to continue that for the next fifteen.</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy & Culture — paired editorial blocks */}
      <section className="section warm">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>OUR VALUES</span></div>
            <div className="sh-r"><h2 className="hd-1">A <i>legacy</i> built on discipline, dedication and standards.</h2></div>
          </div>

          <div className="about-pair-grid">
            <Reveal>
              <div className="eyebrow"><span className="dot"></span>LEGACY</div>
              <h3 className="hd-3" style={{ marginTop: 12 }}>Discipline and dedication, project by project.</h3>
              <p className="body-lg" style={{ marginTop: 14 }}>Our continued success is a testament to the commitment of our people and the standards we hold ourselves to on every site. We are proud of a core team of engineers, project managers and construction professionals who bring deep experience and genuine accountability to every project they oversee — that consistency in the people, in the process, and in the outcome is what keeps our clients returning.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="eyebrow"><span className="dot"></span>CULTURE</div>
              <h3 className="hd-3" style={{ marginTop: 12 }}>Stability and standards, at every level.</h3>
              <p className="body-lg" style={{ marginTop: 14 }}>Anchor fosters a working culture that values long-term relationships — with clients, with trade partners, and within our own team. This is reflected in the quality and continuity of our work across every project category we serve. Experienced professionals at every level, not just at the top, is what makes the difference between a contractor and a firm clients can genuinely rely on.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience You Can Trust */}
      <section className="section dark">
        <div className="container-wide">
          <div className="about-trust-grid">
            <Reveal>
              <span className="eyebrow dark"><span className="dot"></span>EXPERIENCE YOU CAN TRUST</span>
              <h2 className="hd-1" style={{ color: 'var(--on-dark)', marginTop: 18 }}>A project is more than construction.</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="body-lg" style={{ marginTop: 8 }}>It is a client's investment, an institution's commitment to its own future, and in many cases, a facility that the public will depend on for decades. That is why we place our most experienced people at the helm of every project we undertake, and why we remain involved at every stage — from the first estimate through to handover.</p>
              <p className="body-lg" style={{ marginTop: 18 }}>For fifteen years, we have consistently delivered the best standard of construction service to the clients who place their confidence in us — and we intend to continue that for the next fifteen.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose Anchor — differentiators */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>WHY ANCHOR</span></div>
            <div className="sh-r"><h2 className="hd-1">What sets Anchor apart.</h2></div>
          </div>

          <div className="diff-grid light">
            {diff.map((d, i) => (
              <Reveal key={d.k} delay={(i % 3) * 80} className="diff-card light">
                <span className="diff-num">— {d.k}</span>
                <h3 className="diff-title">{d.t}</h3>
                <p className="diff-body">{d.d}</p>
              </Reveal>
            ))}
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

      {/* Team */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>LEADERSHIP</span></div>
            <div className="sh-r"><h2 className="hd-1">The people steering every project.</h2></div>
          </div>
          <div className="about-team-grid">
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
