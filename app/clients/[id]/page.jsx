import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Reveal, QuoteBlock, CTABlock } from '../../../src/components';
import { getClientRoster, getProjectsForClient } from '../../../lib/queries';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }) {
  const { id } = params;

  const roster = await getClientRoster();
  const client = roster.find((c) => c.slug === id);
  if (!client) notFound();

  const projects = await getProjectsForClient(client.name);
  const hasTestimonial = !!client.testimonialQuote;

  return (
    <main className="page">
      <header className="page-header dark">
        <div className="container-wide">
          <div className="crumb"><Link href="/clients" style={{ color: 'inherit' }}>— CLIENTS</Link> / {client.name.toUpperCase()}</div>
          <div className="title">
            {client.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logoUrl} alt={`${client.name} logo`} className="client-detail-logo" />
            )}
            <h1 className="hd-display" style={{ color: 'var(--on-dark)' }}>{client.name}.</h1>
            <div>
              <p className="lede" style={{ color: 'rgba(236,232,223,0.85)', marginBottom: 16 }}>{client.fullName}</p>
              {client.since && (
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 24 }}>
                  <div><div className="eyebrow dark">PARTNER SINCE</div><div className="hd-3" style={{ color: 'var(--on-dark)', marginTop: 4 }}>{client.since}</div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {hasTestimonial && (
        <section className="section warm">
          <div className="container-narrow">
            <QuoteBlock quote={client.testimonialQuote} who={client.testimonialWho || client.name} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-wide">
          {projects.length === 0 ? (
            <p className="body-lg">Projects for this client will be uploaded soon.</p>
          ) : (
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
          )}
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
