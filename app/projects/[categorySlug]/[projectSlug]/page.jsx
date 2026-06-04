import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectDetail, pickCoverUrl } from '../../../../lib/queries';
import { CTABlock } from '../../../../src/components';
import ProjectGallery from './ProjectGallery';
import ExploreMore from './ExploreMore';

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
  const { project, images, related } = data;
  const cat = project.category;

  // Consistent cover resolution, then surface the cover first in the gallery.
  const coverUrl = pickCoverUrl(images, project.cover_image_url);
  const coverIndex = Math.max(images.findIndex((img) => img.public_url === coverUrl), 0);

  // Status has no dedicated column yet — a completed year implies completion.
  const status = project.year_completed ? 'Completed' : null;

  const metaFields = [
    { label: 'Client', value: project.client },
    { label: 'Project Type', value: cat?.name },
    { label: 'Status', value: status },
    { label: 'Year Completed', value: project.year_completed },
    { label: 'Location', value: project.location },
  ].filter((f) => f.value);

  return (
    <main className="page pd-page">
      {/* Simple header band — solid dark fill, no background image */}
      <header className="pd-head">
        <div className="container-wide">
          <div className="pd-head-top">
            <div className="eyebrow dark"><span className="dot"></span>{cat?.name?.toUpperCase()}</div>
            <Link
              href={cat?.slug ? `/projects/${cat.slug}` : '/projects'}
              className="eyebrow dark pd-back"
            >
              ← Back to {cat?.name || 'projects'}
            </Link>
          </div>
          <h1 className="hd-display pd-head-title">{project.title}.</h1>
        </div>
      </header>

      {/* Gallery (left) + metadata & description (right) */}
      <section className="section pd-body">
        <div className="container-wide">
          <div className="pd-layout">
            <div className="pd-layout-main">
              <ProjectGallery
                images={images}
                initialIndex={coverIndex}
                title={project.title}
              />
            </div>

            <aside className="pd-layout-side">
              <div className="pd-info">
                <div className="pd-info-row">
                  <span className="lbl">Name</span>
                  <span className="val">{project.title}</span>
                </div>
                {metaFields.map((f) => (
                  <div className="pd-info-row" key={f.label}>
                    <span className="lbl">{f.label}</span>
                    <span className="val">{f.value}</span>
                  </div>
                ))}
              </div>

              {project.description && (
                <div className="pd-info-desc">
                  <span className="eyebrow"><span className="dot"></span>OVERVIEW</span>
                  <p className="body-lg" style={{ whiteSpace: 'pre-wrap', marginTop: 14 }}>
                    {project.description}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Explore more — same-category carousel, soft client-side navigation */}
      {related.length > 0 && (
        <section className="section dark">
          <div className="container-wide">
            <div className="sec-head">
              <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>MORE IN {cat?.name?.toUpperCase()}</span></div>
              <div className="sh-r" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
                <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>Explore more projects.</h2>
                <Link href={cat?.slug ? `/projects/${cat.slug}` : '/projects'} className="link-arrow" style={{ color: 'var(--on-dark)' }}>
                  View all
                </Link>
              </div>
            </div>
          </div>
          <ExploreMore items={related} categorySlug={cat?.slug} />
        </section>
      )}

      <CTABlock />
    </main>
  );
}
