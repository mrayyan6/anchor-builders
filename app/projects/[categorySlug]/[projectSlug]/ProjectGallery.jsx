'use client';
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * Project image gallery — large main image with a thumbnail strip beneath.
 * Clicking a thumbnail swaps the main image (no page reload). The selected
 * thumbnail is fully clear; the rest are dimmed + lightly blurred.
 *
 * `images` is ordered by sort_order. `initialIndex` selects the cover.
 */
export default function ProjectGallery({ images = [], initialIndex = 0, title = '' }) {
  const safeImages = images.filter((img) => img?.public_url);
  const startIndex = Math.min(Math.max(initialIndex, 0), Math.max(safeImages.length - 1, 0));
  const [active, setActive] = useState(startIndex);

  if (safeImages.length === 0) {
    return (
      <div className="img-box r-43 pd-gallery-empty">
        <div className="ph">{title || '— no image —'}</div>
      </div>
    );
  }

  const current = safeImages[Math.min(active, safeImages.length - 1)];

  return (
    <div className="pd-gallery2">
      <div className="img-box r-43 pd-gallery-main">
        <Image
          key={current.id || active}
          src={current.public_url}
          alt={current.alt_text || title}
          fill
          sizes="(max-width: 900px) 100vw, 55vw"
          priority
          className="img-box-img"
        />
      </div>

      {current.caption && (
        <div className="muted small pd-gallery-caption">{current.caption}</div>
      )}

      {safeImages.length > 1 && (
        <div className="pd-thumbs" role="listbox" aria-label="Project images">
          {safeImages.map((img, i) => (
            <button
              type="button"
              key={img.id || i}
              className={`pd-thumb${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-selected={i === active}
              role="option"
            >
              <span className="img-box r-43">
                <Image
                  src={img.public_url}
                  alt={img.alt_text || `${title} thumbnail ${i + 1}`}
                  fill
                  sizes="120px"
                  className="img-box-img"
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
