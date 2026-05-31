'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '../../../../../utils/supabase/server';
import { STORAGE_BUCKET } from '../../../../../lib/queries';

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
  revalidatePath(`/admin/projects/${projectId}/images`);
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/', 'layout');
}

/**
 * Persist a new image record after the file has been uploaded to storage
 * by the client. The client provides storage_path + public_url; we insert
 * the row at the next sort_order for that project.
 */
export async function recordUploadedImage(form) {
  const supabase = await requireAdmin();
  const project_id = String(form.get('project_id') || '');
  const storage_path = String(form.get('storage_path') || '');
  const public_url = String(form.get('public_url') || '');
  const alt_text = String(form.get('alt_text') || '').trim() || null;
  const caption = String(form.get('caption') || '').trim() || null;

  if (!project_id || !storage_path || !public_url) {
    return { error: 'Missing upload metadata.' };
  }

  const { data: last } = await supabase
    .from('project_images')
    .select('sort_order')
    .eq('project_id', project_id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from('project_images')
    .insert({ project_id, storage_path, public_url, alt_text, caption, sort_order, is_cover: false })
    .select('id')
    .single();
  if (error) return { error: error.message };

  bust(project_id);
  return { ok: true, id: data?.id };
}

export async function updateImageMeta(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  const project_id = String(form.get('project_id') || '');
  if (!id || !project_id) return { error: 'Missing image id.' };

  const alt_text = String(form.get('alt_text') || '').trim() || null;
  const caption = String(form.get('caption') || '').trim() || null;

  const { error } = await supabase
    .from('project_images')
    .update({ alt_text, caption })
    .eq('id', id);
  if (error) return { error: error.message };

  bust(project_id);
  return { ok: true };
}

/**
 * Mark one image as the cover. Sets is_cover = true on it, false on every
 * other image in the same project, and updates projects.cover_image_url.
 */
export async function setCoverImage(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  const project_id = String(form.get('project_id') || '');
  if (!id || !project_id) return { error: 'Missing image id.' };

  const { data: img, error: imgErr } = await supabase
    .from('project_images')
    .select('public_url, project_id')
    .eq('id', id)
    .single();
  if (imgErr || !img || img.project_id !== project_id) {
    return { error: 'Image not found for this project.' };
  }

  const { error: e1 } = await supabase
    .from('project_images')
    .update({ is_cover: false })
    .eq('project_id', project_id);
  if (e1) return { error: e1.message };

  const { error: e2 } = await supabase
    .from('project_images')
    .update({ is_cover: true })
    .eq('id', id);
  if (e2) return { error: e2.message };

  const { error: e3 } = await supabase
    .from('projects')
    .update({ cover_image_url: img.public_url, updated_at: new Date().toISOString() })
    .eq('id', project_id);
  if (e3) return { error: e3.message };

  bust(project_id);
  return { ok: true };
}

/**
 * Delete an image. Remove the storage file first, then the DB row.
 * If the deleted image was the cover, clear projects.cover_image_url.
 */
export async function deleteImage(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  const project_id = String(form.get('project_id') || '');
  if (!id || !project_id) return { error: 'Missing image id.' };

  const { data: img, error: imgErr } = await supabase
    .from('project_images')
    .select('storage_path, is_cover, project_id')
    .eq('id', id)
    .single();
  if (imgErr || !img || img.project_id !== project_id) {
    return { error: 'Image not found for this project.' };
  }

  if (img.storage_path) {
    const service = createServiceClient();
    const { error: rmErr } = await service.storage.from(STORAGE_BUCKET).remove([img.storage_path]);
    if (rmErr) return { error: `Storage delete failed: ${rmErr.message}` };
  }

  const { error: delErr } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id);
  if (delErr) return { error: delErr.message };

  if (img.is_cover) {
    await supabase
      .from('projects')
      .update({ cover_image_url: null, updated_at: new Date().toISOString() })
      .eq('id', project_id);
  }

  bust(project_id);
  return { ok: true };
}

/**
 * Move an image one step up or down — swap sort_order with the neighbour.
 */
export async function reorderImage(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  const project_id = String(form.get('project_id') || '');
  const direction = String(form.get('direction') || '');
  if (!id || !project_id || (direction !== 'up' && direction !== 'down')) {
    return { error: 'Bad reorder request.' };
  }

  const { data: rows, error } = await supabase
    .from('project_images')
    .select('id, sort_order')
    .eq('project_id', project_id)
    .order('sort_order', { ascending: true });
  if (error) return { error: error.message };

  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return { error: 'Image not in this project.' };
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= rows.length) return { ok: true };

  const a = rows[idx];
  const b = rows[targetIdx];

  // Use a temporary value to avoid unique-constraint conflicts (if any)
  const tmp = -1 - Math.abs(a.sort_order);
  await supabase.from('project_images').update({ sort_order: tmp }).eq('id', a.id);
  await supabase.from('project_images').update({ sort_order: a.sort_order }).eq('id', b.id);
  await supabase.from('project_images').update({ sort_order: b.sort_order }).eq('id', a.id);

  bust(project_id);
  return { ok: true };
}
