'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toSlug } from '../../../utils/slug';
import { createProject, updateProject, deleteProject } from './actions';

function emptyForm(defaults = {}) {
  return {
    title: '',
    slug: '',
    category_id: defaults.category_id || '',
    description: '',
    location: '',
    year_completed: '',
    is_featured: false,
    is_active: true,
    sort_order: 0,
  };
}

export default function ProjectsClient({ initialProjects, categories, filterCat }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(emptyForm({ category_id: filterCat || (categories[0]?.id || '') }));
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  function onCatFilter(val) {
    const sp = new URLSearchParams(searchParams.toString());
    if (val) sp.set('cat', val); else sp.delete('cat');
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  function startAdd() {
    setEditingId(null);
    setShowAdd(true);
    setError('');
    setDraft(emptyForm({ category_id: filterCat || (categories[0]?.id || '') }));
  }

  function startEdit(p) {
    setEditingId(p.id);
    setShowAdd(false);
    setError('');
    setDraft({
      title: p.title || '',
      slug: p.slug || '',
      category_id: p.category_id || '',
      description: p.description || '',
      location: p.location || '',
      year_completed: p.year_completed ?? '',
      is_featured: !!p.is_featured,
      is_active: !!p.is_active,
      sort_order: p.sort_order ?? 0,
    });
  }

  function cancel() {
    setEditingId(null);
    setShowAdd(false);
    setError('');
  }

  function build(extra = {}) {
    const fd = new FormData();
    fd.set('title', draft.title);
    fd.set('slug', draft.slug || toSlug(draft.title));
    fd.set('category_id', draft.category_id);
    fd.set('description', draft.description || '');
    fd.set('location', draft.location || '');
    if (draft.year_completed !== '' && draft.year_completed !== null) {
      fd.set('year_completed', String(draft.year_completed));
    }
    if (draft.is_featured) fd.set('is_featured', 'on');
    if (draft.is_active) fd.set('is_active', 'on');
    fd.set('sort_order', String(draft.sort_order || 0));
    Object.entries(extra).forEach(([k, v]) => fd.set(k, v));
    return fd;
  }

  function run(action, fd, options = {}) {
    setError('');
    setFlash('');
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) { setError(res.error); return; }
      cancel();
      const projectId = options.projectId || res?.id;
      if (options.goToImages && projectId) {
        router.push(`/admin/projects/${projectId}/images`);
        return;
      }
      setFlash('Saved.');
      router.refresh();
    });
  }

  function onAddSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim()) return setError('Title is required.');
    if (!draft.category_id) return setError('Category is required.');
    const goToImages = e.nativeEvent.submitter?.dataset?.afterSave === 'images';
    run(createProject, build(), { goToImages });
  }

  function onEditSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim()) return setError('Title is required.');
    if (!draft.category_id) return setError('Category is required.');
    const goToImages = e.nativeEvent.submitter?.dataset?.afterSave === 'images';
    run(updateProject, build({ id: editingId }), { goToImages, projectId: editingId });
  }

  function onDelete(p) {
    const sure = confirm(`Delete "${p.title}"?\n\nAll images for this project will also be deleted from storage. This cannot be undone.`);
    if (!sure) return;
    const fd = new FormData();
    fd.set('id', p.id);
    run(deleteProject, fd);
  }

  const isEditing = (id) => editingId === id;

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}

      <div className="admin-toolbar two">
        <button className="btn btn-primary" onClick={startAdd} disabled={pending}>
          <span>New project</span>
        </button>
        <div className="filter-inline">
          <label className="mono">FILTER · CATEGORY</label>
          <select value={filterCat || ''} onChange={(e) => onCatFilter(e.target.value)} disabled={pending}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {showAdd && (
        <form className="admin-form" onSubmit={onAddSubmit}>
          <ProjectFields draft={draft} setDraft={setDraft} categories={categories} disabled={pending} />
          {error && <div className="form-error">{error}</div>}
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              <span>{pending ? 'Saving…' : 'Create'}</span>
            </button>
            <button type="submit" className="btn btn-ghost" data-after-save="images" disabled={pending}>
              <span>Create and add images</span>
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancel} disabled={pending}>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Order</th>
              <th>Project</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialProjects.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">No projects {filterCat ? 'in this category' : 'yet'}. Add one above.</td></tr>
            )}
            {initialProjects.map((p) => (
              isEditing(p.id) ? (
                <tr key={p.id} className="editing">
                  <td colSpan={6}>
                    <form className="admin-form inline" onSubmit={onEditSubmit}>
                      <ProjectFields draft={draft} setDraft={setDraft} categories={categories} disabled={pending} />
                      {error && <div className="form-error">{error}</div>}
                      <div className="admin-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={pending}>
                          <span>{pending ? 'Saving…' : 'Save'}</span>
                        </button>
                        <button type="submit" className="btn btn-ghost" data-after-save="images" disabled={pending}>
                          <span>Save and manage images</span>
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={cancel} disabled={pending}>
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td className="mono">{p.sort_order}</td>
                  <td>
                    <div className="strong">{p.title}</div>
                    <div className="muted small mono">{p.slug}{p.location ? ` · ${p.location}` : ''}</div>
                  </td>
                  <td>{p.category?.name || <em className="muted">—</em>}</td>
                  <td className="mono small">{p.year_completed ?? '—'}</td>
                  <td>
                    <span className={`pill ${p.is_active ? 'on' : 'off'}`}>{p.is_active ? 'Active' : 'Hidden'}</span>
                    {p.is_featured && <span className="pill warm" style={{ marginLeft: 6 }}>Featured</span>}
                  </td>
                  <td>
                    <Link className="link-btn" href={`/admin/projects/${p.id}/images`}>Images</Link>
                    <button className="link-btn" onClick={() => startEdit(p)} disabled={pending}>Edit</button>
                    <button className="link-btn danger" onClick={() => onDelete(p)} disabled={pending}>Delete</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectFields({ draft, setDraft, categories, disabled }) {
  return (
    <div className="admin-fields">
      <div className="field">
        <label>Title</label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          disabled={disabled}
          required
        />
      </div>
      <div className="field">
        <label>Slug</label>
        <input
          type="text"
          value={draft.slug}
          onChange={(e) => setDraft({ ...draft, slug: toSlug(e.target.value) })}
          onBlur={() => setDraft((d) => ({ ...d, slug: toSlug(d.slug || d.title) }))}
          placeholder={toSlug(draft.title) || 'auto-from-title'}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label>Category</label>
        <select
          value={draft.category_id}
          onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}
          disabled={disabled}
          required
        >
          <option value="">— Select —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}{!c.is_active ? ' (hidden)' : ''}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Year completed</label>
        <input
          type="number"
          value={draft.year_completed}
          onChange={(e) => setDraft({ ...draft, year_completed: e.target.value === '' ? '' : Number(e.target.value) })}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label>Location</label>
        <input
          type="text"
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label>Sort order</label>
        <input
          type="number"
          value={draft.sort_order}
          onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
          disabled={disabled}
        />
      </div>
      <div className="field full">
        <label>Description</label>
        <textarea
          rows={3}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="field check">
        <label>
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
            disabled={disabled}
          /> Active (publicly visible)
        </label>
      </div>
      <div className="field check">
        <label>
          <input
            type="checkbox"
            checked={draft.is_featured}
            onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
            disabled={disabled}
          /> Featured (homepage)
        </label>
      </div>
    </div>
  );
}
