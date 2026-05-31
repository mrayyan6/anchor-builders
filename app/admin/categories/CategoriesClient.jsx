'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toSlug } from '../../../utils/slug';
import { createCategory, updateCategory, deleteCategory } from './actions';

function emptyForm() {
  return { name: '', slug: '', description: '', sort_order: 0, is_active: true };
}

export default function CategoriesClient({ initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(emptyForm());
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  function startEdit(cat) {
    setEditingId(cat.id);
    setShowAdd(false);
    setError('');
    setDraft({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      sort_order: cat.sort_order ?? 0,
      is_active: !!cat.is_active,
    });
  }

  function startAdd() {
    setEditingId(null);
    setShowAdd(true);
    setError('');
    setDraft(emptyForm());
  }

  function cancel() {
    setEditingId(null);
    setShowAdd(false);
    setError('');
    setDraft(emptyForm());
  }

  async function submit(action, fd) {
    setError('');
    setFlash('');
    return new Promise((resolve) => {
      startTransition(async () => {
        const res = await action(fd);
        if (res?.error) {
          setError(res.error);
        } else {
          cancel();
          setFlash('Saved.');
          router.refresh();
        }
        resolve(res);
      });
    });
  }

  function buildFormData(extra = {}) {
    const fd = new FormData();
    fd.set('name', draft.name);
    fd.set('slug', draft.slug || toSlug(draft.name));
    fd.set('description', draft.description || '');
    fd.set('sort_order', String(draft.sort_order || 0));
    if (draft.is_active) fd.set('is_active', 'on');
    Object.entries(extra).forEach(([k, v]) => fd.set(k, v));
    return fd;
  }

  function onAddSubmit(e) {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError('Name is required.');
      return;
    }
    submit(createCategory, buildFormData());
  }

  function onEditSubmit(e) {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError('Name is required.');
      return;
    }
    submit(updateCategory, buildFormData({ id: editingId }));
  }

  async function onDelete(cat) {
    const sure = confirm(`Delete "${cat.name}"?\n\nAll projects in this category and their images will also be removed. This cannot be undone.`);
    if (!sure) return;
    const fd = new FormData();
    fd.set('id', cat.id);
    submit(deleteCategory, fd);
  }

  const isEditing = (id) => editingId === id;

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}

      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={startAdd} disabled={pending}>
          <span>{showAdd ? 'Adding…' : 'New category'}</span>
        </button>
      </div>

      {showAdd && (
        <form className="admin-form" onSubmit={onAddSubmit}>
          <CategoryFields
            draft={draft}
            setDraft={setDraft}
            disabled={pending}
          />
          {error && <div className="form-error">{error}</div>}
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              <span>{pending ? 'Saving…' : 'Create'}</span>
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
              <th>Name</th>
              <th>Slug</th>
              <th>Active</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 && (
              <tr><td colSpan={5} className="admin-empty">No categories yet. Add one above.</td></tr>
            )}
            {initial.map((cat) => (
              isEditing(cat.id) ? (
                <tr key={cat.id} className="editing">
                  <td colSpan={5}>
                    <form className="admin-form inline" onSubmit={onEditSubmit}>
                      <CategoryFields
                        draft={draft}
                        setDraft={setDraft}
                        disabled={pending}
                      />
                      {error && <div className="form-error">{error}</div>}
                      <div className="admin-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={pending}>
                          <span>{pending ? 'Saving…' : 'Save'}</span>
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={cancel} disabled={pending}>
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={cat.id}>
                  <td className="mono">{cat.sort_order}</td>
                  <td>
                    <div className="strong">{cat.name}</div>
                    {cat.description && <div className="muted small">{cat.description}</div>}
                  </td>
                  <td className="mono small">{cat.slug}</td>
                  <td>
                    <span className={`pill ${cat.is_active ? 'on' : 'off'}`}>
                      {cat.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <button className="link-btn" onClick={() => startEdit(cat)} disabled={pending}>Edit</button>
                    <button className="link-btn danger" onClick={() => onDelete(cat)} disabled={pending}>Delete</button>
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

function CategoryFields({ draft, setDraft, disabled }) {
  return (
    <div className="admin-fields">
      <div className="field">
        <label>Name</label>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
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
          onBlur={() => setDraft((d) => ({ ...d, slug: toSlug(d.slug || d.name) }))}
          placeholder={toSlug(draft.name) || 'auto-from-name'}
          disabled={disabled}
        />
      </div>
      <div className="field full">
        <label>Description</label>
        <textarea
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
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
      <div className="field check">
        <label>
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
            disabled={disabled}
          /> Active
        </label>
      </div>
    </div>
  );
}
