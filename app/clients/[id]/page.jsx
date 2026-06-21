import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_DATA } from '../../../src/data';
import { Reveal, QuoteBlock, CTABlock } from '../../../src/components';
import { getProjectsForClient, getDynamicClients } from '../../../lib/queries';
import { toSlug } from '../../../utils/slug';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }) {
  const { id } = params;

  // Resolve the client: curated roster first (by roster id), otherwise a
  // dynamic client (derived from Supabase projects.client) matched by name-slug.
  const curated = SITE_DATA.byId(SITE_DATA.CLIENTS, id);
  let client = curated;
  if (!client) {
    const dynamicClients = await getDynamicClients();
    client = dynamicClients.find((d) => toSlug(d.name) === id) || null;
  }
  if (!client) notFound();

  // Real, displayable Supabase projects for this client (no hardcoded samples).
  const projects = await getProjectsForClient(client.name);
  const testimonial = curated
    ? SITE_DATA.TESTIMONIALS.find((t) => t.clientId === id)
    : null;

  // Curated marketing count stays as the headline number; the grid shows what's
  // actually uploaded. They can differ → show an "Other projects…" note.
  const curatedCount = curated ? curated.projects : null;
  const displayed = projects.length;
  const statCount = curatedCount != null ? curatedCount : displayed;
  const showShortfall =
    displayed > 0 && curatedCount != null && displayed < curatedCount;

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
                {client.since && (
                  <div><div className="eyebrow dark">PARTNER SINCE</div><div className="hd-3" style={{ color: 'var(--on-dark)', marginTop: 4 }}>{client.since}</div></div>
                )}
                <div><div className="eyebrow dark">PROJECTS</div><div className="hd-3" style={{ color: 'var(--on-dark)', marginTop: 4 }}>{statCount}</div></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {curated && client.since && (
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
      )}

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

          {displayed === 0 ? (
            <p className="body-lg">Projects for this client will be uploaded soon.</p>
          ) : (
            <>
              <div className="db-proj-grid">
                {projects.map((p, i) => {
                  const href = p.category?.slug
                    ? `/projects/${p.category.slug}/${p.slug}`
                    : '/projects';
                  return (
                    <Reveal key={p.id} delay={(i % 3) * 80}>
                      <Link
                        href={href}
                        className="proj-card"
                        data-cursor="view"
                        data-cursor-label="View"
                      >
                        <div className="img-box r-43">
                          {p.cover_image_url ? (
                            <Image
                              src={p.cover_image_url}
                              alt={p.title}
                              fill
                              sizes="(max-width: 800px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="img-box-img"
                            />
                          ) : (
                            <div className="ph">{p.title}</div>
                          )}
                        </div>
                        <div className="cat">{p.category?.name || '—'}</div>
                        <div className="meta">
                          <div className="nm">{p.title}</div>
                          <div className="loc">{[p.location, p.year_completed].filter(Boolean).join(' · ')}</div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
              {showShortfall && (
                <p className="body-lg" style={{ marginTop: 32 }}>Other projects will be uploaded.</p>
              )}
            </>
          )}
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
