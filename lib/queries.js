import { createClient } from '../utils/supabase/server';

const STORAGE_BUCKET = 'project-images';

/**
 * All active categories, sorted by sort_order.
 */
export async function getActiveCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('project_categories')
    .select('id, name, slug, description, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    console.error('getActiveCategories', error.message);
    return [];
  }
  return data || [];
}

/**
 * All active projects with their (active) category joined. Sorted by category
 * then project sort_order.
 */
export async function getActiveProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      description,
      location,
      year_completed,
      cover_image_url,
      is_featured,
      sort_order,
      category:project_categories!inner ( id, name, slug, sort_order, is_active )
    `)
    .eq('is_active', true)
    .eq('category.is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('getActiveProjects', error.message);
    return [];
  }
  return data || [];
}

/**
 * Active, featured projects for the homepage. Ordered by sort_order.
 */
export async function getFeaturedProjects(limit = 6) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      location,
      year_completed,
      cover_image_url,
      sort_order,
      category:project_categories!inner ( name, slug, is_active )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .eq('category.is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  if (error) {
    console.error('getFeaturedProjects', error.message);
    return [];
  }
  return data || [];
}

/**
 * Active category + its active projects, by category slug.
 */
export async function getCategoryWithProjects(categorySlug) {
  const supabase = createClient();
  const { data: category, error: catErr } = await supabase
    .from('project_categories')
    .select('id, name, slug, description, sort_order')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .maybeSingle();
  if (catErr || !category) return null;

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, location, year_completed, cover_image_url, description, sort_order')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { category, projects: projects || [] };
}

/**
 * One project (active) by category slug + project slug, with its category
 * and ordered gallery images.
 */
export async function getProjectDetail(categorySlug, projectSlug) {
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      id, title, slug, description, location, year_completed,
      cover_image_url, is_featured,
      category:project_categories!inner ( id, name, slug, is_active )
    `)
    .eq('slug', projectSlug)
    .eq('category.slug', categorySlug)
    .eq('is_active', true)
    .eq('category.is_active', true)
    .maybeSingle();
  if (error || !project) return null;

  const { data: images } = await supabase
    .from('project_images')
    .select('id, storage_path, public_url, alt_text, caption, is_cover, sort_order')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true });

  return { project, images: images || [] };
}

/**
 * Resolve a stored path to a public URL. Falls back to public_url if a
 * caller already has it.
 */
export function getPublicUrl(supabase, storagePath) {
  if (!storagePath) return null;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data?.publicUrl || null;
}

export { STORAGE_BUCKET };
