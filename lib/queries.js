import { createClient } from '../utils/supabase/server';
import { canonicalClientKey, getCuratedClientOptions } from '../utils/clients';
import { SITE_DATA } from '../src/data';
import { toSlug } from '../utils/slug';

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
 * Active, displayable projects belonging to a client, matched by canonical
 * client key (so "PARC" matches a project stored as "Pakistan Agricultural
 * Research Council", while "PMDC" never matches "PMDC (Medical)"). Ordered by
 * sort_order; includes the category slug so cards can deep-link to the detail
 * page.
 */
export async function getProjectsForClient(clientName) {
  const key = canonicalClientKey(clientName);
  if (!key) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, title, slug, location, year_completed, cover_image_url, client, sort_order,
      category:project_categories!inner ( name, slug, is_active )
    `)
    .eq('is_active', true)
    .eq('category.is_active', true)
    .order('sort_order', { ascending: true });
  if (error || !Array.isArray(data)) {
    if (error) console.error('getProjectsForClient', error.message);
    return [];
  }
  return data.filter((p) => canonicalClientKey(p.client) === key);
}

/**
 * Options for the admin client dropdown: the curated roster (always present)
 * merged with any extra clients saved in the optional `clients` table (custom
 * ones added via the admin form). Deduped by canonical key. If the `clients`
 * table doesn't exist yet, the curated roster is returned unchanged.
 */
export async function getClientOptions() {
  const curated = getCuratedClientOptions();
  const seen = new Set(curated.map((c) => canonicalClientKey(c.name)));
  const extras = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('clients')
      .select('name, full_name')
      .order('name', { ascending: true });
    if (Array.isArray(data)) {
      for (const row of data) {
        const key = canonicalClientKey(row.name);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        extras.push({ name: row.name, fullName: row.full_name || row.name });
      }
    }
  } catch {
    // `clients` table is optional — fall back to the curated roster only.
  }
  return [...curated, ...extras];
}

/**
 * The full client roster used by /clients and /clients/[id]. The Supabase
 * `clients` table is the source of truth for metadata + total_projects; the
 * curated SITE_DATA.CLIENTS roster is the fallback when the table is missing or
 * a field is empty. Clients that only exist in projects.client (custom/dynamic,
 * not yet in the table) are appended. Each entry includes a live `uploaded`
 * count and a `total` (with safe fallback to the uploaded count).
 */
export async function getClientRoster() {
  const map = new Map();

  // 1) Curated fallback base.
  for (const c of SITE_DATA.CLIENTS) {
    const key = canonicalClientKey(c.name);
    const t = SITE_DATA.TESTIMONIALS.find((x) => x.clientId === c.id);
    map.set(key, {
      key,
      slug: c.id,
      name: c.name,
      fullName: c.fullName || c.name,
      sector: c.sector || 'Private',
      since: c.since ?? null,
      total: c.projects ?? null,
      testimonialQuote: t?.quote || null,
      testimonialWho: t?.who || null,
      dynamic: false,
    });
  }

  // 2) DB rows override (authoritative once seeded). Optional table.
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('clients')
      .select('name, slug, full_name, sector, since, total_projects, testimonial_quote, testimonial_who');
    if (Array.isArray(data)) {
      for (const r of data) {
        const key = canonicalClientKey(r.name);
        const prev = map.get(key) || {};
        map.set(key, {
          key,
          slug: r.slug || prev.slug || toSlug(r.name),
          name: r.name || prev.name,
          fullName: r.full_name || prev.fullName || r.name,
          sector: r.sector || prev.sector || 'Private',
          since: r.since ?? prev.since ?? null,
          total: r.total_projects != null ? r.total_projects : (prev.total ?? null),
          testimonialQuote: r.testimonial_quote || prev.testimonialQuote || null,
          testimonialWho: r.testimonial_who || prev.testimonialWho || null,
          dynamic: prev.dynamic ?? false,
        });
      }
    }
  } catch {
    // clients table optional — curated fallback already in place.
  }

  // 3) Append clients that only exist in projects.client, and capture uploaded
  //    counts for every client.
  const dynamic = await getDynamicClients();
  const uploadedByKey = new Map();
  for (const d of dynamic) {
    const key = canonicalClientKey(d.name);
    uploadedByKey.set(key, d.projects);
    if (!map.has(key)) {
      map.set(key, {
        key,
        slug: toSlug(d.name),
        name: d.name,
        fullName: d.name,
        sector: 'Private',
        since: null,
        total: d.projects ?? null,
        testimonialQuote: null,
        testimonialWho: null,
        dynamic: true,
      });
    }
  }

  // 4) Safe count fallback: if total is missing/zero but projects are uploaded,
  //    use the uploaded count so the roster never under-reports.
  for (const entry of map.values()) {
    const uploaded = uploadedByKey.get(entry.key) || 0;
    entry.uploaded = uploaded;
    if (entry.total == null) entry.total = uploaded;
    else if (entry.total === 0 && uploaded > 0) entry.total = uploaded;
  }

  return [...map.values()];
}

/**
 * All client rows for the admin clients manager (all editable columns).
 * Returns [] if the optional `clients` table is missing.
 */
export async function getAllClients() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, slug, full_name, sector, since, total_projects, testimonial_quote, testimonial_who')
      .order('name', { ascending: true });
    if (error || !Array.isArray(data)) return [];
    return data;
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
