'use client';
import React, { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../../utils/supabase/client';
import { convertToWebp, isImageFile, MAX_UPLOAD_BYTES } from '../../../../../utils/image';
import {
  recordUploadedImage,
  updateImageMeta,
  setCoverImage,
  deleteImage,
  reorderImage,
} from './actions';

const STORAGE_BUCKET = 'project-images';

export default function ImagesClient({ project, categorySlug, initialImages }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [meta, setMeta] = useState({ alt_text: '', caption: '' });

  const supabase = createClient();
  const projectId = project.id;

  if (!categorySlug || !project.slug) {
    return (
      <div className="form-error">
        This project needs a category and slug before images can be uploaded.
      </div>
    );
  }

  async function onFilesPicked(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await uploadFiles(files);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function uploadFiles(files) {
    setError('');
    setFlash('');
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let succeeded = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        if (!isImageFile(file)) {
          throw new Error(`"${file.name}" is not an image.`);
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          throw new Error(`"${file.name}" is larger than 5 MB.`);
        }

        const blob = await convertToWebp(file);
        const ext = 'webp';
        const filename = `${crypto.randomUUID()}.${ext}`;
        const path = `projects/${categorySlug}/${project.slug}/${filename}`;

        const { error: upErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, blob, { contentType: 'image/webp', upsert: false });
        if (upErr) throw upErr;

        const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        const publicUrl = publicData?.publicUrl;
        if (!publicUrl) throw new Error('No public URL returned.');

        const fd = new FormData();
        fd.set('project_id', projectId);
        fd.set('storage_path', path);
        fd.set('public_url', publicUrl);
        const res = await recordUploadedImage(fd);
        if (res?.error) {
          // Try to roll back the storage file if DB insert failed
          await supabase.storage.from(STORAGE_BUCKET).remove([path]);
          throw new Error(res.error);
        }
        succeeded += 1;
      } catch (err) {
        setError(err?.message || 'Upload failed.');
      }
      setProgress({ done: i + 1, total: files.length });
    }

    setUploading(false);
    if (succeeded > 0) {
      setFlash(`${succeeded} image${succeeded === 1 ? '' : 's'} uploaded.`);
      router.refresh();
    }
  }

  function run(action, fd) {
    setError('');
    setFlash('');
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) { setError(res.error); return; }
      setFlash('Saved.');
      router.refresh();
    });
  }

  function startEdit(img) {
    setEditingId(img.id);
    setMeta({ alt_text: img.alt_text || '', caption: img.caption || '' });
    setError('');
  }
  function cancelEdit() {
    setEditingId(null);
    setMeta({ alt_text: '', caption: '' });
  }
  function saveMeta(img) {
    const fd = new FormData();
    fd.set('id', img.id);
    fd.set('project_id', projectId);
    fd.set('alt_text', meta.alt_text);
    fd.set('caption', meta.caption);
    run(updateImageMeta, fd);
    cancelEdit();
  }

  function makeCover(img) {
    const fd = new FormData();
    fd.set('id', img.id);
    fd.set('project_id', projectId);
    run(setCoverImage, fd);
  }

  function move(img, direction) {
    const fd = new FormData();
    fd.set('id', img.id);
    fd.set('project_id', projectId);
    fd.set('direction', direction);
    run(reorderImage, fd);
  }

  function onDelete(img) {
    const sure = confirm(`Delete this image? This cannot be undone.`);
    if (!sure) return;
    const fd = new FormData();
    fd.set('id', img.id);
    fd.set('project_id', projectId);
    run(deleteImage, fd);
  }

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}

      <div className="admin-toolbar">
        <label className="btn btn-primary upload-label">
          <span>{uploading ? `Uploading… ${progress.done}/${progress.total}` : 'Upload images'}</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFilesPicked}
            disabled={uploading || pending}
            style={{ display: 'none' }}
          />
        </label>
        <div className="mono small muted">
          Auto-converted to WebP · Max 5MB per image
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="image-grid">
        {initialImages.length === 0 && (
          <div className="admin-empty wide">No images yet. Use the upload button above.</div>
        )}
        {initialImages.map((img, idx) => (
          <div key={img.id} className={`image-card${img.is_cover ? ' is-cover' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.public_url} alt={img.alt_text || ''} className="image-thumb" loading="lazy" />
            <div className="image-meta">
              <div className="row">
                <span className="mono small">#{idx + 1}</span>
                {img.is_cover && <span className="pill warm">Cover</span>}
              </div>
              {editingId === img.id ? (
                <>
                  <div className="field">
                    <label>Alt text</label>
                    <input
                      type="text"
                      value={meta.alt_text}
                      onChange={(e) => setMeta({ ...meta, alt_text: e.target.value })}
                      disabled={pending}
                    />
                  </div>
                  <div className="field">
                    <label>Caption</label>
                    <input
                      type="text"
                      value={meta.caption}
                      onChange={(e) => setMeta({ ...meta, caption: e.target.value })}
                      disabled={pending}
                    />
                  </div>
                  <div className="row gap">
                    <button className="link-btn" onClick={() => saveMeta(img)} disabled={pending}>Save</button>
                    <button className="link-btn" onClick={cancelEdit} disabled={pending}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  {img.alt_text && <div className="small muted">{img.alt_text}</div>}
                  {img.caption && <div className="small">{img.caption}</div>}
                  <div className="row gap wrap">
                    {!img.is_cover && (
                      <button className="link-btn" onClick={() => makeCover(img)} disabled={pending || uploading}>Set as cover</button>
                    )}
                    <button className="link-btn" onClick={() => startEdit(img)} disabled={pending || uploading}>Edit</button>
                    <button className="link-btn" onClick={() => move(img, 'up')} disabled={pending || uploading || idx === 0}>↑</button>
                    <button className="link-btn" onClick={() => move(img, 'down')} disabled={pending || uploading || idx === initialImages.length - 1}>↓</button>
                    <button className="link-btn danger" onClick={() => onDelete(img)} disabled={pending || uploading}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
