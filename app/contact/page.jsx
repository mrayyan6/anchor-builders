'use client';
import React from 'react';
import { SITE_DATA } from '../../src/data';

export default function ContactPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">— CONTACT / GET IN TOUCH</div>
          <div className="title">
            <h1 className="hd-display">Tell us about <i>your project.</i></h1>
            <p className="lede">Send a brief — scope, location, timeline. Our team responds within 48 hours, typically with a costed proposal or a request for a site visit.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-wide">
          <div className="contact-grid">
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

            <div className="contact-info">
              <div className="ci-block">
                <span className="lbl">PHONE</span>
                <span className="val"><a href="tel:+923347999336">+92 334 7999336</a></span>
                <span className="val"><a href="tel:+923325966556">+92 332 5966556</a></span>
              </div>
              <div className="ci-block">
                <span className="lbl">EMAIL</span>
                <span className="val"><a href="mailto:anchorassociates.builders@gmail.com">anchorassociates.<br/>builders@gmail.com</a></span>
              </div>
              <div className="ci-block">
                <span className="lbl">OFFICE</span>
                <span className="val">Islamabad,<br/>Pakistan.</span>
              </div>
              <div className="ci-block">
                <span className="lbl">REGISTRATION</span>
                <span className="val" style={{ fontSize: 18 }}>PEC Registered · Category C-2</span>
              </div>
              <div className="ci-block">
                <span className="lbl">HOURS</span>
                <span className="val" style={{ fontSize: 18 }}>Mon — Sat · 9am – 6pm PKT</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
