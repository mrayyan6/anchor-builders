import React from 'react';
import Link from 'next/link';
import { SITE_DATA } from '../src/data';
import {
  Reveal, ImgBox, Hero, ClientMarquee, CTABlock, QuoteBlock,
} from '../src/components';
import HomeFeatured from './HomeFeatured';
import { getFeaturedProjects } from '../lib/queries';
import { balancedSpanClass } from '../src/grid';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featured = await getFeaturedProjects(6);

  const heroFrames = [
    { src: SITE_DATA.IMG.archA, caption: 'PARC AZRI · UMERKOT, SINDH' },
    { src: SITE_DATA.IMG.archC, caption: 'ALKARAM UNIVERSITY · ISLAMABAD' },
    { src: SITE_DATA.IMG.greenA, caption: 'INTELLIGENT GLASS HOUSE · NARC' },
    { src: SITE_DATA.IMG.intC, caption: "CHAI JEE'S CAFÉ · ISLAMABAD" },
  ];

  // Show 6 featured services on home (full list lives on /services)
  const featuredServices = SITE_DATA.SERVICES.slice(0, 6);

  return (
    <main className="page">
      <Hero
        frames={heroFrames}
        eyebrow="ANCHOR ASSOCIATES & BUILDERS"
        title="A proud tradition of service"
      />

      {/* Intro / proud tradition */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l">
              <span className="eyebrow"><span className="dot"></span>OUR APPROACH</span>
            </div>
            <div className="sh-r">
              <h2 className="hd-1">A name built not on the size of our firm, but on the <i>consistency</i> of our work.</h2>
              <p className="lede">With a proven legacy of government and institutional delivery, our approach to every project is rooted in understanding exactly what the client needs — and finishing only when that need has been exceeded. That commitment has been the foundation of every project we have completed and every relationship we have built over the past decade and a half.</p>
              <Link href="/about" className="link-arrow" style={{ marginTop: 16 }}>Read our story</Link>
            </div>
          </div>
        </div>

        {/* Editorial split image */}
        <div className="container-wide" style={{ marginTop: 48 }}>
          <div className="home-editorial-grid">
            <Reveal mode="image"><ImgBox src={SITE_DATA.IMG.archD} ratio="r-169" /></Reveal>
            <div className="home-editorial-col">
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
            <div className="stat"><div className="n">15<span className="u">+</span></div><div className="l">Years of service</div></div>
            <div className="stat"><div className="n">150<span className="u">+</span></div><div className="l">Projects delivered</div></div>
            <div className="stat"><div className="n">50<span className="u">+</span></div><div className="l">Clients served</div></div>
            <div className="stat"><div className="n">C-2</div><div className="l">PEC registered</div></div>
          </div>
        </div>
      </section>

      {/* Why Choose Anchor — differentiators */}
      <section className="section dark">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>WHY ANCHOR</span></div>
            <div className="sh-r">
              <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>What sets us apart, on every site.</h2>
              <p className="lede" style={{ color: 'rgba(236,232,223,0.7)', marginTop: 16 }}>From category registration to research-grade builds, the combination of capabilities below is what brings government bodies, universities and private developers back to Anchor — project after project.</p>
            </div>
          </div>

          <div className="diff-grid">
            {SITE_DATA.DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.k} delay={(i % 3) * 80} className={`diff-card ${balancedSpanClass(i, SITE_DATA.DIFFERENTIATORS.length)}`}>
                <span className="diff-num">— {d.k}</span>
                <h3 className="diff-title">{d.t}</h3>
                <p className="diff-body">{d.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section warm">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>SERVICES</span></div>
            <div className="sh-r" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <div>
                <h2 className="hd-1">A wide range of services, under one delivery team.</h2>
                <p className="lede" style={{ marginTop: 16 }}>From the first estimate to final handover — civil, MEP, prefab, interiors, soundproofing, studios, shades, research facilities, and pre-construction design. The technical capability and site-level discipline to ensure every project reaches its full potential.</p>
              </div>
              <Link href="/services" className="link-arrow">View all services</Link>
            </div>
          </div>
          <div className="svc-grid">
            {featuredServices.map((s) => (
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
      {featured.length > 0 && (
        <section className="section dark">
          <div className="container-wide">
            <div className="sec-head">
              <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>SELECTED WORK</span></div>
              <div className="sh-r" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
                <div>
                  <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>We take pride in<br/>the projects we've done.</h2>
                  <p className="lede" style={{ color: 'rgba(236,232,223,0.7)', marginTop: 16 }}>From large-scale civil works to highly specialist builds, every project is an institution's investment in its own future — and we treat it accordingly.</p>
                </div>
                <Link href="/projects" className="link-arrow" style={{ color: 'var(--on-dark)' }}>View all projects</Link>
              </div>
            </div>
          </div>

          <HomeFeatured items={featured} />
        </section>
      )}

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
