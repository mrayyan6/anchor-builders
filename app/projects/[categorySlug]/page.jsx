import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryWithProjects } from '../../../lib/queries';
import { Reveal, CTABlock } from '../../../src/components';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { categorySlug } = params;
  const data = await getCategoryWithProjects(categorySlug);
  if (!data) return { title: 'Category not found — Anchor' };
  return { title: `${data.category.name} — Anchor Associates & Builders` };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = params;
  const data = await getCategoryWithProjects(categorySlug);
  if (!data) notFound();
  const { category, projects } = data;

  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">
            — <Link href="/projects" style={{ color: 'inherit' }}>PROJECTS</Link> / {category.name.toUpperCase()}
          </div>
          <div className="title">
            <h1 className="hd-display">{category.name}.</h1>
            <p className="lede">
              {category.description || `${projects.length} project${projects.length === 1 ? '' : 's'} delivered in this category.`}
            </p>
          </div>
        </div>
      </header>

      <section style={{ padding: '0 0 96px' }}>
        <div className="container-wide">
          {projects.length === 0 ? (
            <p className="lede">No projects to show in this category yet.</p>
          ) : (
            <div className="db-proj-grid">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <Link
                    href={`/projects/${category.slug}/${p.slug}`}
                    className="proj-card"
                    data-cursor="view"
                    data-cursor-label="View"
                  >
                    <div className={`img-box ${i % 5 === 0 ? 'r-tall' : 'r-43'}`}>
                      {p.cover_image_url ? (
                        <Image
                          src={p.cover_image_url}
                          alt={p.title}
                          fill
                          sizes="(max-width: 800px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="img-box-img"
                        />
                      ) : (
                        <div className="ph">{p.title}</div>
                      )}
                    </div>
                    <div className="cat">{category.name}</div>
                    <div className="meta">
                      <div className="nm">{p.title}</div>
                      <div className="loc">{[p.location, p.year_completed].filter(Boolean).join(' · ')}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
