'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '../../../utils/supabase/server';
import { toSlug } from '../../../utils/slug';
import { STORAGE_BUCKET } from '../../../lib/queries';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/');
  return supabase;
}

function bust(projectId) {
  revalidatePath('/admin/projects');
  if (projectId) revalidatePath(`/admin/projects/${projectId}/images`);
  revalidatePath('/projects');
  revalidatePath('/', 'layout');
}

function readForm(form) {
  return {
    title: String(form.get('title') || '').trim(),
    slug: String(form.get('slug') || '').trim(),
    category_id: String(form.get('category_id') || '').trim(),
    description: String(form.get('description') || '').trim() || null,
    location: String(form.get('location') || '').trim() || null,
    year_completed: form.get('year_completed') ? Number(form.get('year_completed')) : null,
    is_featured: form.get('is_featured') === 'on' || form.get('is_featured') === 'true',
    is_active: form.get('is_active') === 'on' || form.get('is_active') === 'true',
    sort_order: Number(form.get('sort_order') || 0) || 0,
  };
}

export async function createProject(form) {
  const supabase = await requireAdmin();
  const v = readForm(form);
  if (!v.title) return { error: 'Title is required.' };
  if (!v.category_id) return { error: 'Category is required.' };

  const slug = toSlug(v.slug || v.title);
  if (!slug) return { error: 'Slug could not be generated.' };

  const { data: dup } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (dup) return { error: `Slug "${slug}" is already in use.` };

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...v, slug })
    .select('id')
    .single();
  if (error) return { error: error.message };

  bust(data?.id);
  return { ok: true, id: data?.id };
}

export async function updateProject(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing project id.' };
  const v = readForm(form);
  if (!v.title) return { error: 'Title is required.' };
  if (!v.category_id) return { error: 'Category is required.' };

  const slug = toSlug(v.slug || v.title);
  if (!slug) return { error: 'Slug could not be generated.' };

  const { data: dup } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .maybeSingle();
  if (dup) return { error: `Slug "${slug}" is already in use.` };

  const { error } = await supabase
    .from('projects')
    .update({ ...v, slug, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };

  bust(id);
  return { ok: true };
}

/**
 * Delete a project. Fetch all storage paths first, batch-delete files,
 * then delete the project row (DB cascade removes project_images rows).
 */
export async function deleteProject(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing project id.' };

  const { data: images } = await supabase
    .from('project_images')
    .select('storage_path')
    .eq('project_id', id);

  const paths = (images || []).map((i) => i.storage_path).filter(Boolean);
  if (paths.length > 0) {
    const service = createServiceClient();
    const { error: rmErr } = await service.storage.from(STORAGE_BUCKET).remove(paths);
    if (rmErr) return { error: `Storage cleanup failed: ${rmErr.message}` };
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  bust(id);
  return { ok: true };
}
