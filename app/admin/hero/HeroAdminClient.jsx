'use client';
import React, { useState, useEffect, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { convertToWebp, isImageFile, MAX_UPLOAD_BYTES } from '../../../utils/image';
import { createHeroSlide, updateHeroSlide, deleteHeroSlide } from './actions';

const STORAGE_BUCKET = 'project-images';
const MAX_SLIDES = 5;

export default function HeroAdminClient({ initial, projectImages = [] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');

  // Add-slide state
  const [adding, setAdding] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // Per-row edit state, seeded from the slides and re-synced after each refresh.
  const seed = (list) => {
    const m = {};
    for (const s of list) {
      m[s.id] = { caption: s.caption || '', sort_order: s.sort_order ?? 0, is_active: !!s.is_active };
    }
    return m;
  };
  const [drafts, setDrafts] = useState(() => seed(initial));
  useEffect(() => { setDrafts(seed(initial)); }, [initial]);

  const supabase = createClient();
  const atMax = initial.length >= MAX_SLIDES;
  const activeCount = initial.filter((s) => s.is_active).length;

  function draftFor(slide) {
    return drafts[slide.id] || {
      caption: slide.caption || '',
      sort_order: slide.sort_order ?? 0,
      is_active: !!slide.is_active,
    };
  }
  function setDraft(id, patch) {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), ...patch } }));
  }

  function run(action, fd, okMsg) {
    setError('');
    setFlash('');
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) { setError(res.error); return; }
      setFlash(okMsg || 'Saved.');
      router.refresh();
    });
  }

  async function onAddFile(file) {
    if (!file) return;
    if (atMax) { setError(`You already have ${MAX_SLIDES} slides. Remove one first.`); return; }
    setUploading(true);
    setError('');
    try {
      if (!isImageFile(file)) throw new Error('Not an image file.');
      if (file.size > MAX_UPLOAD_BYTES) throw new Error('File too large (max 50 MB).');

      const blob = await convertToWebp(file);
      const path = `hero/${crypto.randomUUID()}.webp`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, blob, { contentType: 'image/webp', upsert: true });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      if (!pub?.publicUrl) throw new Error('No public URL returned.');

      const fd = new FormData();
      fd.set('image_url', pub.publicUrl);
      fd.set('image_storage_path', path);
      fd.set('caption', newCaption);
      fd.set('sort_order', String(initial.length));
      const res = await createHeroSlide(fd);
      if (res?.error) {
        await supabase.storage.from(STORAGE_BUCKET).remove([path]);
        throw new Error(res.error);
      }
      setNewCaption('');
      setAdding(false);
      setFlash('Slide added.');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Upload failed.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function onPickProjectImage(url) {
    if (atMax) { setError(`You already have ${MAX_SLIDES} slides. Remove one first.`); return; }
    setError('');
    setFlash('');
    startTransition(async () => {
      const fd = new FormData();
      fd.set('image_url', url);
      // No image_storage_path — this reuses a project image, so deleting the
      // hero slide must not delete the shared project image file.
      fd.set('caption', newCaption);
      fd.set('sort_order', String(initial.length));
      const res = await createHeroSlide(fd);
      if (res?.error) { setError(res.error); return; }
      setNewCaption('');
      setAdding(false);
      setFlash('Slide added from project image.');
      router.refresh();
    });
  }

  function onSave(slide) {
    const d = draftFor(slide);
    const fd = new FormData();
    fd.set('id', slide.id);
    fd.set('caption', d.caption || '');
    fd.set('sort_order', String(d.sort_order || 0));
    if (d.is_active) fd.set('is_active', 'on');
    run(updateHeroSlide, fd, 'Slide saved.');
  }

  function onDelete(slide) {
    if (!confirm('Delete this hero slide? This cannot be undone.')) return;
    const fd = new FormData();
    fd.set('id', slide.id);
    if (slide.image_storage_path) fd.set('image_storage_path', slide.image_storage_path);
    run(deleteHeroSlide, fd, 'Slide deleted.');
  }

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}
      {activeCount < 2 && (
        <div className="form-error" style={{ background: '#fdf5e6', borderLeftColor: '#b8860b', color: '#6b4e0e' }}>
          Fewer than 2 active slides — the homepage is using the built-in default hero until you have at least 2 active.
        </div>
      )}
      {error && <div className="form-error">{error}</div>}

      <div className="admin-toolbar">
        <button
          className="btn btn-primary"
          onClick={() => setAdding((a) => !a)}
          disabled={pending || uploading || atMax}
          title={atMax ? `Maximum ${MAX_SLIDES} slides` : ''}
        >
          <span>{atMax ? `Max ${MAX_SLIDES} reached` : adding ? 'Cancel' : 'Add slide'}</span>
        </button>
        <div className="mono small muted">{initial.length}/{MAX_SLIDES} slides · {activeCount} active</div>
      </div>

      {adding && !atMax && (
        <div className="admin-form">
          <div className="admin-fields">
            <div className="field full">
              <label>Caption (shown in the hero counter)</label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="e.g. PARC-AZRC Umerkot"
                disabled={uploading}
              />
            </div>
          </div>
          <label className="btn btn-primary upload-label">
            <span>{uploading ? 'Uploading…' : 'Choose image & add'}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => onAddFile(e.target.files?.[0])}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          <div className="mono small muted" style={{ marginTop: 8 }}>Auto-converted to WebP · Max 50 MB</div>

          {projectImages.length > 0 && (
            <div className="hero-pick">
              <div className="hero-pick-or"><span>or choose from project images</span></div>
              {projectImages.map((grp) => (
                <div key={grp.project_id} className="hero-pick-group">
                  <div className="hero-pick-title">{grp.title}</div>
                  <div className="hero-pick-images">
                    {grp.images.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        className="hero-pick-thumb"
                        onClick={() => onPickProjectImage(img.url)}
                        disabled={pending || uploading}
                        title="Use this image as a hero slide"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="cover-grid" style={{ marginTop: 20 }}>
        {initial.length === 0 && (
          <div className="admin-empty wide">No hero slides yet. Add at least 2.</div>
        )}
        {initial.map((slide) => {
          const d = draftFor(slide);
          return (
            <div key={slide.id} className="cover-card">
              <div className="cover-thumb static">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image_url} alt={slide.caption || 'Hero slide'} />
              </div>
              <div className="cover-meta">
                <div className="field">
                  <label>Caption</label>
                  <input
                    type="text"
                    value={d.caption}
                    onChange={(e) => setDraft(slide.id, { caption: e.target.value })}
                    disabled={pending}
                  />
                </div>
                <div className="row gap" style={{ gap: 16 }}>
                  <div className="field" style={{ maxWidth: 100 }}>
                    <label>Sort order</label>
                    <input
                      type="number"
                      value={d.sort_order}
                      onChange={(e) => setDraft(slide.id, { sort_order: Number(e.target.value) })}
                      disabled={pending}
                    />
                  </div>
                  <div className="field check" style={{ alignSelf: 'flex-end' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={d.is_active}
                        onChange={(e) => setDraft(slide.id, { is_active: e.target.checked })}
                        disabled={pending}
                      /> Active
                    </label>
                  </div>
                </div>
                <div className="row gap" style={{ marginTop: 8 }}>
                  <button className="link-btn" onClick={() => onSave(slide)} disabled={pending}>Save</button>
                  <button className="link-btn danger" onClick={() => onDelete(slide)} disabled={pending}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
