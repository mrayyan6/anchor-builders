'use client';
import React from 'react';
import Link from 'next/link';
import { SITE_DATA } from '../src/data';
import {
  Reveal, ImgBox, ProjectCard, HorizontalSwiper, Hero, ClientMarquee, CTABlock, QuoteBlock,
} from '../src/components';

export default function HomePage() {
  const featured = ['azri', 'alkaram', 'callctr', 'intelligent', 'chajees', 'kingdom']
    .map(id => SITE_DATA.byId(SITE_DATA.PROJECTS, id));

  const heroFrames = [
    { src: SITE_DATA.IMG.archA, caption: 'PARC AZRI · UMERKOT, SINDH' },
    { src: SITE_DATA.IMG.archC, caption: 'ALKARAM UNIVERSITY · ISLAMABAD' },
    { src: SITE_DATA.IMG.greenA, caption: 'INTELLIGENT GLASS HOUSE · NARC' },
    { src: SITE_DATA.IMG.intC, caption: "CHAI JEE'S CAFÉ · ISLAMABAD" },
  ];

  return (
    <main className="page">
      <Hero
        frames={heroFrames}
        eyebrow="ANCHOR ASSOCIATES & BUILDERS"
        title={<>Foundations<br/>for <i>civic</i><br/>life.</>}
        sub="A construction & contracting firm working across Pakistan — from agricultural research labs to turnkey villas, soundproof studios to tensile canopies."
      />

      {/* Intro / pride section */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l">
              <span className="eyebrow"><span className="dot"></span>OUR APPROACH</span>
            </div>
            <div className="sh-r">
              <h2 className="hd-1">We take pride in <i>building</i> things that last — for the people, institutions and places that matter.</h2>
              <p className="lede">Established in 2010, Anchor is a C-2 PEC registered firm based in Islamabad delivering services nationwide. With over a decade of experience, we specialise in civil & MEP, prefabricated & steel, tensile & canopies, agricultural structures, renovation, and specialty construction.</p>
              <Link href="/about" className="link-arrow" style={{ marginTop: 16 }}>Read our story</Link>
            </div>
          </div>
        </div>

        {/* Editorial split image */}
        <div className="container-wide" style={{ marginTop: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
            <Reveal mode="image"><ImgBox src={SITE_DATA.IMG.archD} ratio="r-169" /></Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <Reveal mode="image" delay={120}><ImgBox src={SITE_DATA.IMG.constB} ratio="r-43" /></Reveal>
              <Reveal mode="image" delay={240}><ImgBox src={SITE_DATA.IMG.intB} ratio="r-43" /></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 0 96px' }}>
        <div className="container-wide">
          <div className="stats">
            <div className="stat"><div className="n">15<span className="u">yr</span></div><div className="l">Building since 2010</div></div>
            <div className="stat"><div className="n">140<span className="u">+</span></div><div className="l">Projects delivered</div></div>
            <div className="stat"><div className="n">24</div><div className="l">Govt. institutions</div></div>
            <div className="stat"><div className="n">C-2</div><div className="l">PEC category</div></div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section warm">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>SERVICES</span></div>
            <div className="sh-r">
              <h2 className="hd-1">Six disciplines, one delivery team.</h2>
            </div>
          </div>
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

      {/* Featured projects */}
      <section className="section dark">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>SELECTED WORK</span></div>
            <div className="sh-r" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>Fifteen years.<br/>One hundred forty sites.</h2>
              <Link href="/projects" className="link-arrow" style={{ color: 'var(--on-dark)' }}>View all projects</Link>
            </div>
          </div>
        </div>

        <HorizontalSwiper
          items={featured}
          label="Featured projects · drag or scroll →"
          renderItem={(p) => <ProjectCard project={p} ratio="r-tall" />}
        />
      </section>

      {/* Client marquee + preview */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>OUR CLIENTS</span></div>
            <div className="sh-r" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <h2 className="hd-1">Trusted across <i>government,</i> retainer and private.</h2>
              <Link href="/clients" className="link-arrow">All clients</Link>
            </div>
          </div>
        </div>
        <ClientMarquee />
      </section>

      {/* Testimonial */}
      <section className="section warm">
        <div className="container-narrow">
          <QuoteBlock quote={SITE_DATA.TESTIMONIALS[1].quote} who={SITE_DATA.TESTIMONIALS[1].who} />
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
