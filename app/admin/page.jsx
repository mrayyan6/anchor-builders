import React from 'react';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/server';

export default async function AdminDashboard() {
  const supabase = createClient();
  const [
    { count: catCount },
    { count: projectCount },
    { count: featuredCount },
    { count: imageCount },
  ] = await Promise.all([
    supabase.from('project_categories').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('project_images').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">— ADMIN / DASHBOARD</div>
        <h1 className="hd-2">Welcome back.</h1>
        <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
          Manage project categories, project records and image galleries.
        </p>
      </header>

      <section className="admin-stats">
        <div className="admin-stat">
          <div className="n">{catCount ?? 0}</div>
          <div className="l">Categories</div>
          <Link href="/admin/categories" className="link-arrow">Manage</Link>
        </div>
        <div className="admin-stat">
          <div className="n">{projectCount ?? 0}</div>
          <div className="l">Projects</div>
          <Link href="/admin/projects" className="link-arrow">Manage</Link>
        </div>
        <div className="admin-stat">
          <div className="n">{featuredCount ?? 0}</div>
          <div className="l">Featured</div>
        </div>
        <div className="admin-stat">
          <div className="n">{imageCount ?? 0}</div>
          <div className="l">Images</div>
        </div>
      </section>
    </div>
  );
}
