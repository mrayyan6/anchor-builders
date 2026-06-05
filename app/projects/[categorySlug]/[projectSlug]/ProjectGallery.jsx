'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

/**
 * Project image gallery — large main image with a thumbnail strip beneath.
 * Clicking a thumbnail swaps the main image (no page reload). The selected
 * thumbnail is fully clear; the rest are dimmed + lightly blurred.
 *
 * Loading strategy (keeps the first paint fast, switches instant):
 *   - The cover/initial main image renders immediately with `priority`.
 *   - Thumbnails load normally (small, fast).
 *   - The remaining large images are mounted after the browser is idle, so they
 *     are already cached when a thumbnail is clicked — but never compete with
 *     the initial load / LCP.
 *   - Main images are stacked and crossfaded by opacity, and the previously
 *     shown image stays visible until the newly selected one has loaded — so
 *     switching never flashes a blank box.
 *
 * `images` is ordered by sort_order. `initialIndex` selects the cover.
 */

// The main image area is ~58% of the 1680px-max content column on desktop
// (≈880px), full width once the layout stacks at ≤900px. Telling the browser
// the real displayed width avoids fetching an oversized (e.g. 1920px) variant.
const MAIN_SIZES = '(max-width: 900px) 100vw, (max-width: 1500px) 55vw, 880px';

export default function ProjectGallery({ images = [], initialIndex = 0, title = '' }) {
  const safeImages = images.filter((img) => img?.public_url);
  const startIndex = Math.min(Math.max(initialIndex, 0), Math.max(safeImages.length - 1, 0));

  const [active, setActive] = useState(startIndex);        // selected thumbnail
  const [displayed, setDisplayed] = useState(startIndex);  // image actually shown (only moves once loaded)
  const [loaded, setLoaded] = useState(() => new Set());   // indices whose large image has finished loading
  const [warm, setWarm] = useState(false);                 // mount the rest after idle to pre-cache

  const markLoaded = useCallback((i) => {
    setLoaded((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, []);

  // Reveal the active image only once it has loaded — until then the previously
  // displayed image stays on screen (smooth crossfade, no blank flash).
  useEffect(() => {
    if (loaded.has(active)) setDisplayed(active);
  }, [active, loaded]);

  // After the page is idle, mount the remaining large images so later switches
  // are instant. Deferred so it never competes with the first paint / LCP.
  useEffect(() => {
    if (safeImages.length <= 1 || typeof window === 'undefined') return;
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 800));
    const cic = window.cancelIdleCallback || clearTimeout;
    const id = ric(() => setWarm(true));
    return () => cic(id);
  }, [safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className="img-box r-43 pd-gallery-empty">
        <div className="ph">{title || '— no image —'}</div>
      </div>
    );
  }

  const caption = safeImages[Math.min(displayed, safeImages.length - 1)]?.caption;

  return (
    <div className="pd-gallery2">
      <div className="img-box r-43 pd-gallery-main">
        {safeImages.map((img, i) => {
          // Mount the cover immediately, the clicked image on demand, and the
          // rest after idle — so the initial load is a single large request.
          const mount = i === startIndex || i === active || warm;
          if (!mount) return null;
          return (
            <Image
              key={img.id || i}
              src={img.public_url}
              alt={img.alt_text || title}
              fill
              sizes={MAIN_SIZES}
              priority={i === startIndex}
              onLoad={() => markLoaded(i)}
              className={`img-box-img pd-main-img${i === displayed ? ' is-shown' : ''}`}
            />
          );
        })}
      </div>

      {caption && (
        <div className="muted small pd-gallery-caption">{caption}</div>
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
