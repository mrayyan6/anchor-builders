import React from 'react';
import { createClient } from '../../../utils/supabase/server';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsAdminPage({ searchParams }) {
  const supabase = createClient();

  const filterCat = typeof searchParams?.cat === 'string' ? searchParams.cat : '';

  let query = supabase
    .from('projects')
    .select(`
      id, title, slug, description, location, year_completed,
      is_featured, is_active, sort_order, category_id, cover_image_url,
      category:project_categories ( id, name, slug )
    `)
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });
  if (filterCat) query = query.eq('category_id', filterCat);

  const [{ data: projects }, { data: categories }] = await Promise.all([
    query,
    supabase
      .from('project_categories')
      .select('id, name, slug, is_active')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">— ADMIN / PROJECTS</div>
        <h1 className="hd-2">Projects</h1>
        <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
          Add, edit and manage the public project portfolio.
        </p>
      </header>

      <ProjectsClient
        initialProjects={projects || []}
        categories={categories || []}
        filterCat={filterCat}
      />
    </div>
  );
}
