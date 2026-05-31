import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../../utils/supabase/server';
import ImagesClient from './ImagesClient';

export const dynamic = 'force-dynamic';

export default async function ProjectImagesPage({ params }) {
  const { projectId } = params;
  const supabase = createClient();

  const { data: project } = await supabase
    .from('projects')
    .select(`
      id, title, slug, cover_image_url,
      category:project_categories ( id, name, slug )
    `)
    .eq('id', projectId)
    .maybeSingle();
  if (!project) notFound();

  const { data: images } = await supabase
    .from('project_images')
    .select('id, storage_path, public_url, alt_text, caption, is_cover, sort_order')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">
          — <Link href="/admin/projects" style={{ color: 'inherit' }}>ADMIN / PROJECTS</Link> / IMAGES
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h1 className="hd-2">{project.title}</h1>
            <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Category: <strong>{project.category?.name || '—'}</strong>{' · '}
              Slug: <span className="mono">{project.slug}</span>
            </p>
          </div>
          <Link className="link-arrow" href="/admin/projects">← Back to projects</Link>
        </div>
      </header>

      <ImagesClient
        project={project}
        categorySlug={project.category?.slug || ''}
        initialImages={images || []}
      />
    </div>
  );
}
