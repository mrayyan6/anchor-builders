import React from 'react';
import { notFound } from 'next/navigation';
import { SITE_DATA } from '../../../src/data';
import { ImgBox, CTABlock } from '../../../src/components';
import { getProjectsByCategoryName } from '../../../lib/queries';
import ServiceProjects from './ServiceProjects';

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }) {
  const { id } = params;
  // Service editorial content (name, tagline, scope, hero) stays in SITE_DATA —
  // it is copy, not project data.
  const svc = SITE_DATA.byId(SITE_DATA.SERVICES, id);
  if (!svc) notFound();

  // Related projects come from Supabase, matched by category NAME so they are
  // identical to /projects filtered to this category (same cover images too).
  const { category, projects } = await getProjectsByCategoryName(svc.name);
  const catName = category?.name || svc.name;

  return (
    <main className="page">
      <header className="page-header dark">
        <div className="container-wide">
          <div className="crumb">— SERVICES / {svc.number}</div>
          <div className="title">
            <h1 className="hd-display" style={{ color: 'var(--on-dark)' }}>{svc.name}.</h1>
            <div>
              <p className="lede" style={{ color: 'rgba(236,232,223,0.85)', marginBottom: 24 }}>{svc.tagline}</p>
              <p className="body-lg" style={{ maxWidth: '50ch' }}>{svc.description}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-wide">
          <div className="pd-overview">
            <div className="scope">
              <div className="eyebrow"><span className="dot"></span>SCOPE INCLUDES</div>
              {svc.scope.map((s, i) => (
                <div key={i} className="row"><span className="k">{String(i+1).padStart(2,'0')}</span><span>{s}</span></div>
              ))}
            </div>
            <ImgBox src={svc.hero} ratio="r-43" />
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section warm">
          <div className="container-wide">
            <div className="sec-head">
              <div className="sh-l"><span className="eyebrow"><span className="dot"></span>RECENT WORK</span></div>
              <div className="sh-r"><h2 className="hd-1">{catName} projects we&apos;ve delivered.</h2></div>
            </div>
          </div>
          <ServiceProjects
            items={projects}
            categorySlug={category?.slug}
            label={`${catName} · drag or scroll →`}
          />
        </section>
      )}

      <CTABlock />
    </main>
  );
}
