'use client';
import React, { useState } from 'react';
import { SITE_DATA } from '../../src/data';

/**
 * Interactive brief form. Split out from the contact page so the surrounding
 * page (header + contact info) can render as a server component and only this
 * small island ships/​hydrates client-side JS.
 *
 * On submit it opens Gmail's web compose window (using whichever Google account
 * the visitor is signed into) pre-addressed to Anchor with the form fields in
 * the subject/body — the visitor reviews and presses Send there. If no Google
 * account is signed in, Gmail shows its own sign-in screen; we also surface an
 * on-page note telling the visitor to sign in first.
 *
 * Note: a site cannot reliably detect Google sign-in state without a full OAuth
 * integration, so we rely on Gmail's own login prompt + the instruction below.
 */

// Same address shown in the contact info column + site footer.
const TO_EMAIL = 'anchorassociates.builders@gmail.com';

export default function ContactForm() {
  const [notice, setNotice] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k) => (data.get(k) || '').toString().trim();

    const name = get('name');
    const organisation = get('organisation');
    const email = get('email');
    const phone = get('phone');
    const projectType = get('projectType');
    const brief = get('brief');

    const subject = name ? `Project enquiry — ${name}` : 'Project enquiry';
    const body = [
      `Name: ${name}`,
      organisation && `Organisation: ${organisation}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      projectType && `Project type: ${projectType}`,
      '',
      'Project brief:',
      brief || '(none provided)',
    ]
      .filter(Boolean)
      .join('\n');

    // Gmail web compose deep link — uses the signed-in Google account. If none
    // is signed in, Gmail itself redirects to the Google sign-in page.
    const gmailUrl =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(TO_EMAIL)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Open Gmail in a NEW tab only — never navigate the current tab. A synthetic
    // <a target="_blank"> click behaves like a normal link, so the current page
    // is never redirected (avoids window.open edge cases entirely).
    const link = document.createElement('a');
    link.href = gmailUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setNotice('Gmail has opened in a new tab. If you’re not signed in to a Google account, sign in there first — then press Send in Gmail to deliver your message.');
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <div className="field"><label>Name</label><input type="text" name="name" required /></div>
        <div className="field"><label>Organisation</label><input type="text" name="organisation" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <div className="field"><label>Email</label><input type="email" name="email" required /></div>
        <div className="field"><label>Phone</label><input type="tel" name="phone" /></div>
      </div>
      <div className="field"><label>Project type</label>
        <select name="projectType" defaultValue="">
          <option value="">— Select category —</option>
          {SITE_DATA.CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="field"><label>Project brief</label><textarea name="brief" rows="4" placeholder="Scope, location, timeline, any references…"></textarea></div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><span>Send brief</span><span className="arr"></span></button>
      {notice && (
        <p role="status" style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-3)' }}>
          {notice}
        </p>
      )}
    </form>
  );
}
