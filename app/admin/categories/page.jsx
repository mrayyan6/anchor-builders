import React from 'react';
import { createClient } from '../../../utils/supabase/server';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('project_categories')
    .select('id, name, slug, description, sort_order, is_active')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">— ADMIN / CATEGORIES</div>
        <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div>
            <h1 className="hd-2">Project categories</h1>
            <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Add, edit and order the categories shown across the public site.
            </p>
          </div>
        </div>
      </header>

      <CategoriesClient initial={categories || []} />
    </div>
  );
}
