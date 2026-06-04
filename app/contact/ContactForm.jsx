'use client';
import React from 'react';
import { SITE_DATA } from '../../src/data';

/**
 * Interactive brief form. Split out from the contact page so the surrounding
 * page (header + contact info) can render as a server component and only this
 * small island ships/​hydrates client-side JS.
 */
export default function ContactForm() {
  return (
    <form
      className="contact-form"
      onSubmit={(e) => { e.preventDefault(); alert("Thanks — we'll be in touch within 48 hours."); }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <div className="field"><label>Name</label><input type="text" required /></div>
        <div className="field"><label>Organisation</label><input type="text" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <div className="field"><label>Email</label><input type="email" required /></div>
        <div className="field"><label>Phone</label><input type="tel" /></div>
      </div>
      <div className="field"><label>Project type</label>
        <select defaultValue="">
          <option value="">— Select category —</option>
          {SITE_DATA.CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="field"><label>Project brief</label><textarea rows="4" placeholder="Scope, location, timeline, any references…"></textarea></div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><span>Send brief</span><span className="arr"></span></button>
    </form>
  );
}
