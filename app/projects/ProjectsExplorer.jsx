'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '../../src/components';

export default function ProjectsExplorer({ categories, projects }) {
  const [cat, setCat] = useState('all');

  const counts = useMemo(() => {
    const c = { all: projects.length };
    categories.forEach((cc) => {
      c[cc.id] = projects.filter((p) => p.category?.id === cc.id).length;
    });
    return c;
  }, [categories, projects]);

  const filtered = useMemo(() => {
    if (cat === 'all') return projects;
    return projects.filter((p) => p.category?.id === cat);
  }, [cat, projects]);

  return (
    <>
      <section style={{ padding: '0 0 32px' }}>
        <div className="container-wide">
          <div className="filter-bar">
            <button className={cat === 'all' ? 'active' : ''} onClick={() => setCat('all')}>
              All<span className="count">{counts.all}</span>
            </button>
            {categories.map((c) => (
              <button key={c.id} className={cat === c.id ? 'active' : ''} onClick={() => setCat(c.id)}>
                {c.name}<span className="count">{counts[c.id] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="container-wide">
          {filtered.length === 0 ? (
            <p className="lede">No projects to show yet.</p>
          ) : (
            <div className="db-proj-grid">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <DbProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DbProjectCard({ project, ratio = 'r-43' }) {
  const cat = project.category;
  const href = cat?.slug ? `/projects/${cat.slug}/${project.slug}` : '#';
  return (
    <Link href={href} className="proj-card" data-cursor="view" data-cursor-label="View">
      <div className={`img-box ${ratio}`}>
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 800px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="img-box-img"
          />
        ) : (
          <div className="ph">{project.title}</div>
        )}
      </div>
      <div className="cat">{cat?.name || '—'}</div>
      <div className="meta">
        <div className="nm">{project.title}</div>
        <div className="loc">
          {[project.location, project.year_completed].filter(Boolean).join(' · ')}
        </div>
      </div>
    </Link>
  );
}
