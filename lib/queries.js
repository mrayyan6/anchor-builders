import { createClient } from '../utils/supabase/server';

const STORAGE_BUCKET = 'project-images';

/**
 * Single source of truth for picking a project's cover image.
 * Priority:
 *   1. an image flagged is_cover = true
 *   2. denormalized projects.cover_image_url
 *   3. lowest sort_order image (images are queried sorted, so index 0)
 *   4. first available image
 *   5. null  → UI shows a placeholder
 *
 * `images` is expected to already be ordered by sort_order ascending.
 */
export function pickCoverUrl(images = [], coverImageUrl = null) {
  const flagged = images.find((img) => img.is_cover && img.public_url);
  if (flagged) return flagged.public_url;
  if (coverImageUrl) return coverImageUrl;
  const firstWithUrl = images.find((img) => img.public_url);
  return firstWithUrl?.public_url || null;
}

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
 * Active category + its active projects, matched by category NAME
 * (case-insensitive exact). Used by the editorial /services/[id] pages so
 * their "recent work" carousel shows the SAME Supabase projects as the
 * /projects page filtered to that category — no hardcoded project lists.
 *
 * `ilike` with no % / _ wildcards is a case-insensitive exact match, so it
 * tolerates casing differences (e.g. "Parking Shades & Canopies" vs
 * "Parking shades & canopies").
 */
export async function getProjectsByCategoryName(name) {
  if (!name) return { category: null, projects: [] };
  const supabase = createClient();
  const { data: cats } = await supabase
    .from('project_categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .ilike('name', name)
    .limit(1);
  const category = cats?.[0] || null;
  if (!category) return { category: null, projects: [] };

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, location, year_completed, cover_image_url, sort_order')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { category, projects: projects || [] };
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
      id, title, slug, description, location, year_completed, client,
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

  // Related projects in the same category (for the bottom carousel),
  // excluding the current one. Active only, ordered by sort_order.
  const { data: related } = await supabase
    .from('projects')
    .select('id, title, slug, location, year_completed, cover_image_url, sort_order')
    .eq('category_id', project.category.id)
    .eq('is_active', true)
    .neq('id', project.id)
    .order('sort_order', { ascending: true })
    .limit(12);

  return { project, images: images || [], related: related || [] };
}

/**
 * Clients derived from the `client` column on the `projects` table (NOT a
 * separate clients table). Returns one entry per distinct, non-empty client
 * name across active projects, with a count of how many projects reference it.
 *
 * There is no sector/type information on projects.client, so every derived
 * client is placed in the "Private" display bucket. Returns [] on any error.
 */
export async function getDynamicClients() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('client')
      .eq('is_active', true)
      .not('client', 'is', null);
    if (error || !Array.isArray(data)) return [];

    const byName = new Map();
    for (const row of data) {
      const name = String(row.client || '').trim();
      if (!name) continue;
      const key = name.toLowerCase();
      const existing = byName.get(key);
      if (existing) existing.projects += 1;
      else byName.set(key, { name, projects: 1 });
    }

    return [...byName.values()].map((c, i) => ({
      id: `proj-client-${i}`,
      name: c.name,
      fullName: c.name,
      sector: 'Private',
      since: null,
      projects: c.projects,
      dynamic: true,
    }));
  } catch {
    return [];
  }
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
