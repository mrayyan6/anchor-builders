'use client';
import React from 'react';
import { notFound } from 'next/navigation';
import { SITE_DATA } from '../../../src/data';
import { ImgBox, ProjectCard, HorizontalSwiper, CTABlock } from '../../../src/components';

export default function ServiceDetailPage({ params }) {
  const { id } = params;
  const svc = SITE_DATA.byId(SITE_DATA.SERVICES, id);
  if (!svc) notFound();
  const cat = SITE_DATA.byId(SITE_DATA.CATEGORIES, svc.categoryId);
  const related = SITE_DATA.projectsByCategory(svc.categoryId);

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

      {related.length > 0 && (
        <section className="section warm">
          <div className="container-wide">
            <div className="sec-head">
              <div className="sh-l"><span className="eyebrow"><span className="dot"></span>RECENT WORK</span></div>
              <div className="sh-r"><h2 className="hd-1">{cat?.name} projects we've delivered.</h2></div>
            </div>
          </div>
          <HorizontalSwiper
            items={related}
            label={`${cat?.name} · drag or scroll →`}
            renderItem={(p) => <ProjectCard project={p} ratio="r-43" />}
          />
        </section>
      )}

      <CTABlock />
    </main>
  );
}
