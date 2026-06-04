'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HorizontalSwiper } from '../../../src/components';

/**
 * "Recent work" carousel for a service page. Renders the same Supabase
 * projects (and the same cover_image_url) shown on /projects, linking to the
 * shared /projects/[categorySlug]/[projectSlug] detail route. Cards use
 * next/link, so navigation is a soft client-side transition.
 */
export default function ServiceProjects({ items = [], categorySlug, label }) {
  if (!items || items.length === 0) return null;
  return (
    <HorizontalSwiper
      items={items}
      label={label || 'Drag or scroll →'}
      renderItem={(p) => (
        <Link
          href={categorySlug ? `/projects/${categorySlug}/${p.slug}` : '/projects'}
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
                sizes="(max-width: 800px) 80vw, 30vw"
                className="img-box-img"
              />
            ) : (
              <div className="ph">{p.title}</div>
            )}
          </div>
          <div className="cat">Project</div>
          <div className="meta">
            <div className="nm">{p.title}</div>
            <div className="loc">{[p.location, p.year_completed].filter(Boolean).join(' · ')}</div>
          </div>
        </Link>
      )}
    />
  );
}
