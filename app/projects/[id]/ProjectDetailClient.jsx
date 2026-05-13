'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, notFound } from 'next/navigation';
import { SITE_DATA } from '../../../src/data';
import { Reveal, ImgBox, HorizontalSwiper, CTABlock } from '../../../src/components';

export default function ProjectDetailClient({ params }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const fromType = searchParams?.get('from') || null;
  const fromId = searchParams?.get('id') || null;

  const project = SITE_DATA.byId(SITE_DATA.PROJECTS, id);
  if (!project) notFound();
  const client = SITE_DATA.byId(SITE_DATA.CLIENTS, project.clientId);
  const cat = SITE_DATA.byId(SITE_DATA.CATEGORIES, project.categoryId);

  // Determine swiper context
  let related = [];
  let swiperLabel = '';
  let backLabel = 'Back to projects';
  let backHref = '/projects';

  if (fromType === 'client' && fromId) {
    const c = SITE_DATA.byId(SITE_DATA.CLIENTS, fromId);
    related = SITE_DATA.projectsByClient(fromId).filter(p => p.id !== id);
    swiperLabel = `More projects for ${c?.name || 'this client'} →`;
    backLabel = `Back to ${c?.name || 'client'}`;
    backHref = `/clients/${fromId}`;
  } else {
    const catId = fromType === 'cat' && fromId ? fromId : project.categoryId;
    const c = SITE_DATA.byId(SITE_DATA.CATEGORIES, catId);
    related = SITE_DATA.projectsByCategory(catId).filter(p => p.id !== id);
    swiperLabel = `More ${c?.name || ''} projects →`;
    backLabel = `Back to ${c?.name || 'projects'}`;
    backHref = `/projects`;
  }

  return (
    <main className="page">
      <section className="pd-hero">
        <Image
          src={project.hero}
          alt={project.name}
          fill
          sizes="100vw"
          priority
          className="pd-hero-img"
        />
        <div className="pd-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div className="eyebrow dark"><span className="dot"></span>{cat?.name?.toUpperCase()}</div>
            <Link href={backHref} className="eyebrow dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>← {backLabel}</Link>
          </div>
          <h1 className="hd-display pd-title">{project.name}.</h1>
          <div className="pd-meta">
            <div><span className="lbl">CLIENT</span><span>{client?.name}</span></div>
            <div><span className="lbl">LOCATION</span><span>{project.location}</span></div>
            <div><span className="lbl">YEAR</span><span>{project.year}</span></div>
            <div><span className="lbl">SCALE</span><span>{project.area}</span></div>
            <div><span className="lbl">SCOPE</span><span>{project.scope}</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div className="pd-overview">
            <div>
              <span className="eyebrow"><span className="dot"></span>OVERVIEW</span>
              <h2 className="hd-2" style={{ marginTop: 14 }}>{project.tagline}</h2>
            </div>
            <p className="body-lg">{project.body}</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="container-wide">
          <div className="pd-gallery">
            {project.gallery.map((g, i) => (
              <Reveal key={i} mode="image" className={i === 0 ? 'span2' : ''}>
                <ImgBox src={g} ratio={i === 0 ? 'r-169' : 'r-43'} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container-wide">
          <div className="sec-head">
            <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>{fromType === 'client' ? 'MORE FROM THIS CLIENT' : 'MORE IN THIS CATEGORY'}</span></div>
            <div className="sh-r" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>Continue browsing.</h2>
              <Link href={backHref} className="link-arrow" style={{ color: 'var(--on-dark)' }}>{backLabel}</Link>
            </div>
          </div>
        </div>
        <HorizontalSwiper
          items={related}
          label={swiperLabel}
          renderItem={(p) => (
            <Link
              href={`/projects/${p.id}?from=${fromType || 'cat'}&id=${fromId || project.categoryId}`}
              className="proj-card"
              data-cursor="view"
              data-cursor-label="View"
            >
              <ImgBox src={p.hero} ratio="r-tall" label={p.name} />
              <div className="cat" style={{ color: 'var(--on-dark-mute)' }}>{SITE_DATA.byId(SITE_DATA.CATEGORIES, p.categoryId)?.name}</div>
              <div className="meta">
                <div className="nm" style={{ color: 'var(--on-dark)' }}>{p.name}</div>
                <div className="loc" style={{ color: 'var(--on-dark-mute)' }}>{p.location} · {p.year}</div>
              </div>
            </Link>
          )}
        />
      </section>

      <CTABlock />
    </main>
  );
}