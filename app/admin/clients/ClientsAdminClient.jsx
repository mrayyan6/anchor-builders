'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClientRow, updateClientRow, deleteClientRow } from './actions';

const SECTORS = ['Government', 'Retainer', 'Private'];

function emptyForm() {
  return {
    name: '',
    full_name: '',
    sector: 'Private',
    since: '',
    testimonial_quote: '',
    testimonial_who: '',
  };
}

export default function ClientsAdminClient({ initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(emptyForm());
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  function startEdit(c) {
    setEditingId(c.id);
    setShowAdd(false);
    setError('');
    setDraft({
      name: c.name || '',
      full_name: c.full_name || '',
      sector: c.sector || 'Private',
      since: c.since ?? '',
      testimonial_quote: c.testimonial_quote || '',
      testimonial_who: c.testimonial_who || '',
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

  function submit(action, fd) {
    setError('');
    setFlash('');
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) { setError(res.error); return; }
      cancel();
      setFlash('Saved.');
      router.refresh();
    });
  }

  function build(extra = {}) {
    const fd = new FormData();
    fd.set('name', draft.name);
    fd.set('full_name', draft.full_name || '');
    fd.set('sector', draft.sector || '');
    if (draft.since !== '' && draft.since !== null) fd.set('since', String(draft.since));
    fd.set('testimonial_quote', draft.testimonial_quote || '');
    fd.set('testimonial_who', draft.testimonial_who || '');
    Object.entries(extra).forEach(([k, v]) => fd.set(k, v));
    return fd;
  }

  function onAddSubmit(e) {
    e.preventDefault();
    if (!draft.name.trim()) return setError('Name is required.');
    submit(createClientRow, build());
  }

  function onEditSubmit(e) {
    e.preventDefault();
    if (!draft.name.trim()) return setError('Name is required.');
    submit(updateClientRow, build({ id: editingId }));
  }

  function onDelete(c) {
    const sure = confirm(`Remove "${c.name}" from the clients roster?\n\nThis only removes the roster entry — its projects are not deleted.`);
    if (!sure) return;
    const fd = new FormData();
    fd.set('id', c.id);
    submit(deleteClientRow, fd);
  }

  const isEditing = (id) => editingId === id;

  return (
    <div className="admin-card-wrap">
      {flash && <div className="form-flash">{flash}</div>}

      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={startAdd} disabled={pending}>
          <span>{showAdd ? 'Adding…' : 'New client'}</span>
        </button>
      </div>

      {showAdd && (
        <form className="admin-form" onSubmit={onAddSubmit}>
          <ClientFields draft={draft} setDraft={setDraft} disabled={pending} />
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
              <th>Client</th>
              <th>Sector</th>
              <th style={{ width: 70 }}>Since</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.length === 0 && (
              <tr><td colSpan={4} className="admin-empty">No clients yet.</td></tr>
            )}
            {initial.map((c) => (
              isEditing(c.id) ? (
                <tr key={c.id} className="editing">
                  <td colSpan={4}>
                    <form className="admin-form inline" onSubmit={onEditSubmit}>
                      <ClientFields draft={draft} setDraft={setDraft} disabled={pending} />
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
                <tr key={c.id}>
                  <td>
                    <div className="strong">{c.name}</div>
                    {c.full_name && <div className="muted small">{c.full_name}</div>}
                    {c.testimonial_quote && <div className="muted small">“{c.testimonial_quote}”{c.testimonial_who ? ` — ${c.testimonial_who}` : ''}</div>}
                  </td>
                  <td>{c.sector || <em className="muted">—</em>}</td>
                  <td className="mono small">{c.since ?? '—'}</td>
                  <td>
                    <button className="link-btn" onClick={() => startEdit(c)} disabled={pending}>Edit</button>
                    <button className="link-btn danger" onClick={() => onDelete(c)} disabled={pending}>Delete</button>
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

function ClientFields({ draft, setDraft, disabled }) {
  return (
    <div className="admin-fields">
      <div className="field">
        <label>Short name</label>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          disabled={disabled}
          required
        />
      </div>
      <div className="field">
        <label>Full name</label>
        <input
          type="text"
          value={draft.full_name}
          onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="field">
        <label>Sector</label>
        <select
          value={draft.sector}
          onChange={(e) => setDraft({ ...draft, sector: e.target.value })}
          disabled={disabled}
        >
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Partner since (year)</label>
        <input
          type="number"
          value={draft.since}
          onChange={(e) => setDraft({ ...draft, since: e.target.value === '' ? '' : Number(e.target.value) })}
          disabled={disabled}
        />
      </div>
      <div className="field full">
        <label>Testimonial quote</label>
        <textarea
          rows={2}
          value={draft.testimonial_quote}
          onChange={(e) => setDraft({ ...draft, testimonial_quote: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="field full">
        <label>Testimonial author</label>
        <input
          type="text"
          value={draft.testimonial_who}
          onChange={(e) => setDraft({ ...draft, testimonial_who: e.target.value })}
          placeholder="e.g. Project Director, PARC"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
