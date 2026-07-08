import React from 'react';
import { getAllHeroSlides, getProjectImagesGrouped } from '../../../lib/queries';
import HeroAdminClient from './HeroAdminClient';

export const dynamic = 'force-dynamic';

export default async function HeroAdminPage() {
  const [slides, projectImages] = await Promise.all([
    getAllHeroSlides(),
    getProjectImagesGrouped(),
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">— ADMIN / HERO</div>
        <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div>
            <h1 className="hd-2">Homepage hero</h1>
            <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              The rotating images on the homepage. Use 2–5 active slides; each shows its caption and rotates in sort order.
            </p>
          </div>
        </div>
      </header>

      <HeroAdminClient initial={slides} projectImages={projectImages} />
    </div>
  );
}
