import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjectDetail } from '../../../../lib/queries';
import { Reveal, CTABlock } from '../../../../src/components';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const data = await getProjectDetail(params.categorySlug, params.projectSlug);
  if (!data) return { title: 'Project not found — Anchor' };
  return {
    title: `${data.project.title} — Anchor Associates & Builders`,
    description: data.project.description?.slice(0, 200),
  };
}

export default async function ProjectDetailPage({ params }) {
  const data = await getProjectDetail(params.categorySlug, params.projectSlug);
  if (!data) notFound();
  const { project, images } = data;
  const cat = project.category;
  const cover = project.cover_image_url
    || images.find((img) => img.is_cover)?.public_url
    || images[0]?.public_url
    || null;
  const gallery = images.filter((img) => img.public_url !== cover);

  return (
    <main className="page">
      <section className="pd-hero">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="100vw"
            priority
            className="pd-hero-img"
          />
        ) : (
          <div className="bg" style={{ background: 'var(--ink)' }} />
        )}
        <div className="pd-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div className="eyebrow dark"><span className="dot"></span>{cat?.name?.toUpperCase()}</div>
            <Link
              href={cat?.slug ? `/projects/${cat.slug}` : '/projects'}
              className="eyebrow dark"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              ← Back to {cat?.name || 'projects'}
            </Link>
          </div>
          <h1 className="hd-display pd-title">{project.title}.</h1>
          <div className="pd-meta">
            {cat?.name && <div><span className="lbl">CATEGORY</span><span>{cat.name}</span></div>}
            {project.location && <div><span className="lbl">LOCATION</span><span>{project.location}</span></div>}
            {project.year_completed && <div><span className="lbl">YEAR</span><span>{project.year_completed}</span></div>}
          </div>
        </div>
      </section>

      {project.description && (
        <section className="section">
          <div className="container-wide">
            <div className="pd-overview">
              <div>
                <span className="eyebrow"><span className="dot"></span>OVERVIEW</span>
                <h2 className="hd-2" style={{ marginTop: 14 }}>About this project.</h2>
              </div>
              <p className="body-lg" style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section style={{ padding: '0 0 96px' }}>
          <div className="container-wide">
            <div className="pd-gallery">
              {gallery.map((g, i) => (
                <Reveal key={g.id} mode="image" className={i === 0 ? 'span2' : ''}>
                  <div className={`img-box ${i === 0 ? 'r-169' : 'r-43'}`}>
                    <Image
                      src={g.public_url}
                      alt={g.alt_text || project.title}
                      fill
                      sizes={i === 0 ? '100vw' : '(max-width: 800px) 100vw, 50vw'}
                      className="img-box-img"
                    />
                  </div>
                  {g.caption && <div className="muted small" style={{ marginTop: 8 }}>{g.caption}</div>}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABlock />
    </main>
  );
}
