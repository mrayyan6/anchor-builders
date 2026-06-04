import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_DATA } from '../../../src/data';
import { Reveal, ImgBox, QuoteBlock, CTABlock } from '../../../src/components';

export default function ClientDetailPage({ params }) {
  const { id } = params;
  const client = SITE_DATA.byId(SITE_DATA.CLIENTS, id);
  if (!client) notFound();
  const projects = SITE_DATA.projectsByClient(id);
  const testimonial = SITE_DATA.TESTIMONIALS.find(t => t.clientId === id);

  return (
    <main className="page">
      <header className="page-header dark">
        <div className="container-wide">
          <div className="crumb"><Link href="/clients" style={{ color: 'inherit' }}>— CLIENTS</Link> / {client.sector.toUpperCase()}</div>
          <div className="title">
            <h1 className="hd-display" style={{ color: 'var(--on-dark)' }}>{client.name}.</h1>
            <div>
              <p className="lede" style={{ color: 'rgba(236,232,223,0.85)', marginBottom: 16 }}>{client.fullName}</p>
              <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 24 }}>
                <div><div className="eyebrow dark">SECTOR</div><div className="hd-3" style={{ color: 'var(--on-dark)', marginTop: 4 }}>{client.sector}</div></div>
                <div><div className="eyebrow dark">PARTNER SINCE</div><div className="hd-3" style={{ color: 'var(--on-dark)', marginTop: 4 }}>{client.since}</div></div>
                <div><div className="eyebrow dark">PROJECTS</div><div className="hd-3" style={{ color: 'var(--on-dark)', marginTop: 4 }}>{client.projects}</div></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>RELATIONSHIP</span></div>
            <div className="sh-r">
              <h2 className="hd-1">A {(2026 - client.since)}-year partnership.</h2>
              <p className="body-lg" style={{ marginTop: 14 }}>Anchor has worked with {client.name} since {client.since}, delivering {client.projects} {client.projects === 1 ? 'project' : 'projects'} across {client.sector === 'Government' ? 'institutional, research and administrative' : client.sector === 'Retainer' ? 'commercial and operational' : 'developer and hospitality'} mandates.</p>
            </div>
          </div>
        </div>
      </section>

      {testimonial && (
        <section className="section warm">
          <div className="container-narrow">
            <QuoteBlock quote={testimonial.quote} who={testimonial.who} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>PROJECTS DELIVERED</span></div>
            <div className="sh-r"><h2 className="hd-1">All work for {client.name}.</h2></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <Link
                  href="/projects"
                  className="proj-card"
                  data-cursor="view"
                  data-cursor-label="View"
                >
                  <ImgBox src={p.hero} ratio="r-43" label={p.name} />
                  <div className="cat">{SITE_DATA.byId(SITE_DATA.CATEGORIES, p.categoryId)?.name}</div>
                  <div className="meta">
                    <div className="nm">{p.name}</div>
                    <div className="loc">{p.location} · {p.year}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
            {projects.length === 0 && <p className="body-lg">More {client.name} projects coming soon.</p>}
          </div>
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
