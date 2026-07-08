'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '../../../utils/supabase/server';
import { STORAGE_BUCKET } from '../../../lib/queries';

const MAX_SLIDES = 5;

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
  revalidatePath('/admin/hero');
  revalidatePath('/', 'layout');
}

export async function createHeroSlide(form) {
  const supabase = await requireAdmin();
  const image_url = String(form.get('image_url') || '').trim();
  const image_storage_path = String(form.get('image_storage_path') || '').trim() || null;
  if (!image_url) return { error: 'An image is required.' };

  const { count } = await supabase.from('hero_slides').select('id', { count: 'exact', head: true });
  if ((count || 0) >= MAX_SLIDES) {
    return { error: `You can have at most ${MAX_SLIDES} hero slides. Remove one first.` };
  }

  const caption = String(form.get('caption') || '').trim() || null;
  const sort_order = Number(form.get('sort_order') || 0) || 0;

  const { error } = await supabase
    .from('hero_slides')
    .insert({ image_url, image_storage_path, caption, sort_order, is_active: true });
  if (error) {
    console.error('createHeroSlide:', error.message);
    return { error: 'Could not save slide. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function updateHeroSlide(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing slide id.' };

  const caption = String(form.get('caption') || '').trim() || null;
  const sort_order = Number(form.get('sort_order') || 0) || 0;
  const is_active = form.get('is_active') === 'on' || form.get('is_active') === 'true';

  const { error } = await supabase
    .from('hero_slides')
    .update({ caption, sort_order, is_active })
    .eq('id', id);
  if (error) {
    console.error('updateHeroSlide:', error.message);
    return { error: 'Could not update slide. Please try again.' };
  }
  bust();
  return { ok: true };
}

export async function deleteHeroSlide(form) {
  const supabase = await requireAdmin();
  const id = String(form.get('id') || '');
  if (!id) return { error: 'Missing slide id.' };

  const storagePath = String(form.get('image_storage_path') || '').trim();
  if (storagePath) {
    try { await createServiceClient().storage.from(STORAGE_BUCKET).remove([storagePath]); } catch {}
  }

  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) {
    console.error('deleteHeroSlide:', error.message);
    return { error: 'Could not delete slide. Please try again.' };
  }
  bust();
  return { ok: true };
}
