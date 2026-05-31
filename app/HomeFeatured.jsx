'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HorizontalSwiper } from '../src/components';

/**
 * Renders the featured-projects swiper on the homepage using Supabase data.
 * Lives in its own client component so we can keep app/page.jsx a server
 * component (data fetched server-side, SEO-friendly).
 */
export default function HomeFeatured({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <HorizontalSwiper
      items={items}
      label="Featured projects · drag or scroll →"
      renderItem={(p) => <FeaturedCard project={p} />}
    />
  );
}

function FeaturedCard({ project }) {
  const cat = project.category;
  const href = cat?.slug ? `/projects/${cat.slug}/${project.slug}` : '/projects';
  return (
    <Link
      href={href}
      className="proj-card"
      data-cursor="view"
      data-cursor-label="View"
    >
      <div className="img-box r-tall">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 800px) 80vw, 28vw"
            className="img-box-img"
          />
        ) : (
          <div className="ph">{project.title}</div>
        )}
      </div>
      <div className="cat" style={{ color: 'var(--on-dark-mute)' }}>{cat?.name || '—'}</div>
      <div className="meta">
        <div className="nm" style={{ color: 'var(--on-dark)' }}>{project.title}</div>
        <div className="loc" style={{ color: 'var(--on-dark-mute)' }}>
          {[project.location, project.year_completed].filter(Boolean).join(' · ')}
        </div>
      </div>
    </Link>
  );
}
