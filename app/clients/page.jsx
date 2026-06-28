import React from 'react';
import Link from 'next/link';
import { Reveal, CTABlock } from '../../src/components';
import { getClientRoster } from '../../lib/queries';

export const dynamic = 'force-dynamic';

function getClientGridSpanClass(index, total) {
  const remainder = total % 3;
  const isLast = index === total - 1;
  const isSecondLast = index === total - 2;

  if (remainder === 1 && isLast) return 'client-span-full';
  if (remainder === 2 && (isSecondLast || isLast)) return 'client-span-half';
  return '';
}

export default async function ClientsPage() {
  const allClients = await getClientRoster();

  return (
    <main className="page">
      <header className="page-header page-header-center">
        <div className="container-wide">
          <div className="crumb">— CLIENTS / OUR VALUED CLIENTS</div>
          <div className="title">
            <h1 className="hd-display">A roster built over <i>fifteen years.</i></h1>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container-narrow">
          <Reveal>
            <span className="eyebrow"><span className="dot"></span>HOW WE WORK</span>
            <h2 className="hd-2" style={{ marginTop: 16 }}>Our clients are part of the team.</h2>
            <p className="body-lg" style={{ marginTop: 18 }}>Anchor has always embraced our clients and partners as part of our team. Every project is performed with open communication, full transparency, and a shared commitment to outcomes that both sides can be proud of. The trust our clients place in us is something we take seriously — and work every day to deserve.</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div className="clients-grid">
            {allClients.map((c, i) => {
              const spanClass = getClientGridSpanClass(i, allClients.length);
              return (
                <Link key={c.slug} href={`/clients/${c.slug}`} className={`client-card${spanClass ? ` ${spanClass}` : ''}`}>
                  <div className="cc-meta">
                    <span>{c.since ? `SINCE ${c.since}` : ''}</span>
                  </div>
                  <span className="cc-arrow">↗</span>
                  <div className="cc-name-wrap">
                    <h3 className="cc-name">{c.name}</h3>
                    <p className="cc-full">{c.fullName}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
