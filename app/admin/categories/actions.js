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

function bust() {
  revalidatePath('/admin/categories');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/', 'layout');
}

export async function createCategory(form) {
  const supabase = await requireAdmin();
  const name = String(form.get('name') || '').trim();
  if (!name) return { error: 'Name is required.' };

  const slug = toSlug(form.get('slug') || name);
  if (!slug) return { error: 'Slug could not be generated from name.' };

  const description = String(form.get('description') || '').trim() || null;
  const sort_order = Number(form.get('sort_order') || 0) || 0;
  const is_active = form.get('is_active') === 'on' || form.get('is_active') === 'true';

  const { data: dup } = await supabase
    .from('project_categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (dup) return { error: `Slug "${slug}" is already in use.` };

  const { error } = await supabase
    .from('project_categories')
    .insert({ name, slug, description, sort_order, is_active });
  if (error) return { error: error.message };

  bust();
  return { ok: true };
}

export async function updateCategory(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing category id.' };

  const name = String(form.get('name') || '').trim();
  if (!name) return { error: 'Name is required.' };

  const slug = toSlug(form.get('slug') || name);
  if (!slug) return { error: 'Slug could not be generated.' };

  const description = String(form.get('description') || '').trim() || null;
  const sort_order = Number(form.get('sort_order') || 0) || 0;
  const is_active = form.get('is_active') === 'on' || form.get('is_active') === 'true';

  const { data: dup } = await supabase
    .from('project_categories')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .maybeSingle();
  if (dup) return { error: `Slug "${slug}" is already in use.` };

  const { error } = await supabase
    .from('project_categories')
    .update({ name, slug, description, sort_order, is_active, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };

  bust();
  return { ok: true };
}

/**
 * Delete a category. Before deleting the DB row we must collect every
 * project_images storage_path under every project in this category and
 * remove the files from storage. DB cascades clean up the rows.
 */
export async function deleteCategory(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing category id.' };

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('category_id', id);

  const projectIds = (projects || []).map((p) => p.id);
  if (projectIds.length > 0) {
    const { data: images } = await supabase
      .from('project_images')
      .select('storage_path')
      .in('project_id', projectIds);

    const paths = (images || []).map((i) => i.storage_path).filter(Boolean);
    if (paths.length > 0) {
      const service = createServiceClient();
      const { error: rmErr } = await service.storage.from(STORAGE_BUCKET).remove(paths);
      if (rmErr) return { error: `Storage cleanup failed: ${rmErr.message}` };
    }
  }

  const { error } = await supabase.from('project_categories').delete().eq('id', id);
  if (error) return { error: error.message };

  bust();
  return { ok: true };
}
