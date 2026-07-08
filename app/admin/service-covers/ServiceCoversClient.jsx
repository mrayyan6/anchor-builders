'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { convertToWebp, isImageFile, MAX_UPLOAD_BYTES } from '../../../utils/image';
import { updateServiceCover, deleteServiceCover } from './actions';

const STORAGE_BUCKET = 'project-images';

export default function ServiceCoversClient({ initial }) {
  const router = useRouter();
  const [flash, setFlash] = useState('');
  const supabase = createClient();

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}
      <div className="cover-grid">
        {initial.map((svc) => (
          <ServiceCoverCard
            key={svc.id}
            svc={svc}
            supabase={supabase}
            onSaved={(msg) => { setFlash(msg); router.refresh(); }}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceCoverCard({ svc, supabase, onSaved }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      if (!isImageFile(file)) throw new Error('Not an image file.');
      if (file.size > MAX_UPLOAD_BYTES) throw new Error('File too large (max 50 MB).');

      const blob = await convertToWebp(file);
      const path = `service-covers/${svc.id}-${crypto.randomUUID()}.webp`;

      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, blob, { contentType: 'image/webp', upsert: true });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      if (!pub?.publicUrl) throw new Error('No public URL returned.');

      const fd = new FormData();
      fd.set('service_id', svc.id);
      fd.set('image_url', pub.publicUrl);
      fd.set('image_storage_path', path);
      if (svc.image_storage_path) fd.set('previous_storage_path', svc.image_storage_path);
      const res = await updateServiceCover(fd);
      if (res?.error) throw new Error(res.error);

      onSaved(`Updated cover for ${svc.name}.`);
    } catch (err) {
      setError(err?.message || 'Upload failed.');
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function onRemove() {
    if (!confirm(`Remove the cover image for "${svc.name}"? It will fall back to the default.`)) return;
    setBusy(true);
    setError('');
    try {
      const fd = new FormData();
      fd.set('service_id', svc.id);
      if (svc.image_storage_path) fd.set('image_storage_path', svc.image_storage_path);
      const res = await deleteServiceCover(fd);
      if (res?.error) throw new Error(res.error);
      onSaved(`Removed cover for ${svc.name}.`);
    } catch (err) {
      setError(err?.message || 'Could not remove.');
    }
    setBusy(false);
  }

  const shown = svc.image_url || svc.fallback;

  return (
    <div className="cover-card">
      <label
        className="cover-thumb"
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
        onDragOver={(e) => e.preventDefault()}
        title="Click or drag an image to replace"
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt={svc.name} />
        ) : (
          <span className="cover-ph">No image</span>
        )}
        {busy && <span className="cover-busy">Uploading…</span>}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={busy}
          style={{ display: 'none' }}
        />
      </label>
      <div className="cover-meta">
        <div className="mono small muted">— {svc.number}</div>
        <div className="strong">{svc.name}</div>
        <div className="mono small" style={{ color: svc.image_url ? 'var(--warm-deep)' : 'var(--ink-3)' }}>
          {svc.image_url ? 'Custom image' : 'Using default'}
        </div>
        {error && <div className="form-error" style={{ marginTop: 6 }}>{error}</div>}
        <div className="row gap" style={{ marginTop: 8 }}>
          <label className="link-btn" style={{ cursor: 'pointer' }}>
            {svc.image_url ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={busy}
              style={{ display: 'none' }}
            />
          </label>
          {svc.image_url && (
            <button type="button" className="link-btn danger" onClick={onRemove} disabled={busy}>Remove</button>
          )}
        </div>
      </div>
    </div>
  );
}
