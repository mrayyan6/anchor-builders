import React from 'react';
import ContactForm from './ContactForm';

export const metadata = { title: 'Contact — Anchor Associates & Builders' };

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
            <ContactForm />

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
