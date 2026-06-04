'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HorizontalSwiper } from '../../../../src/components';

/**
 * Bottom "Explore more projects" carousel. Reuses the site's HorizontalSwiper
 * (drag + arrow controls). Cards link via next/link, so moving between
 * projects is a soft client-side navigation — no full page reload.
 */
export default function ExploreMore({ items = [], categorySlug, label }) {
  if (!items || items.length === 0) return null;
  return (
    <HorizontalSwiper
      items={items}
      label={label || 'Explore more projects · drag or scroll →'}
      renderItem={(p) => (
        <Link
          href={`/projects/${categorySlug}/${p.slug}`}
          className="proj-card"
          data-cursor="view"
          data-cursor-label="View"
        >
          <div className="img-box r-tall">
            {p.cover_image_url ? (
              <Image
                src={p.cover_image_url}
                alt={p.title}
                fill
                sizes="(max-width: 800px) 80vw, 28vw"
                className="img-box-img"
              />
            ) : (
              <div className="ph">{p.title}</div>
            )}
          </div>
          <div className="cat" style={{ color: 'var(--on-dark-mute)' }}>Project</div>
          <div className="meta">
            <div className="nm" style={{ color: 'var(--on-dark)' }}>{p.title}</div>
            <div className="loc" style={{ color: 'var(--on-dark-mute)' }}>
              {[p.location, p.year_completed].filter(Boolean).join(' · ')}
            </div>
          </div>
        </Link>
      )}
    />
  );
}
