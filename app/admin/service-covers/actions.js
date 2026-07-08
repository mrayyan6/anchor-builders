'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '../../../utils/supabase/server';
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
  revalidatePath('/admin/service-covers');
  revalidatePath('/services', 'layout');
  revalidatePath('/', 'layout');
}

export async function updateServiceCover(form) {
  const supabase = await requireAdmin();
  const service_id = String(form.get('service_id') || '').trim();
  const image_url = String(form.get('image_url') || '').trim();
  const image_storage_path = String(form.get('image_storage_path') || '').trim() || null;
  if (!service_id || !image_url) return { error: 'Missing service or image.' };

  // Remove a previous storage file if the new upload replaced it at a new path.
  const prevPath = String(form.get('previous_storage_path') || '').trim();
  if (prevPath && prevPath !== image_storage_path) {
    try { await createServiceClient().storage.from(STORAGE_BUCKET).remove([prevPath]); } catch {}
  }

  const { error } = await supabase
    .from('service_covers')
    .upsert(
      { service_id, image_url, image_storage_path, updated_at: new Date().toISOString() },
      { onConflict: 'service_id' }
    );
  if (error) {
    console.error('updateServiceCover:', error.message);
    return { error: 'Could not save cover image. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function deleteServiceCover(form) {
  const supabase = await requireAdmin();
  const service_id = String(form.get('service_id') || '').trim();
  if (!service_id) return { error: 'Missing service id.' };

  const storagePath = String(form.get('image_storage_path') || '').trim();
  if (storagePath) {
    try { await createServiceClient().storage.from(STORAGE_BUCKET).remove([storagePath]); } catch {}
  }

  const { error } = await supabase.from('service_covers').delete().eq('service_id', service_id);
  if (error) {
    console.error('deleteServiceCover:', error.message);
    return { error: 'Could not remove cover image. Please try again.' };
  }
  bust();
  return { ok: true };
}
