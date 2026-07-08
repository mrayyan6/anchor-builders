import React from 'react';
import Link from 'next/link';
import { CTABlock } from '../../src/components';
import { getClientRoster } from '../../lib/queries';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const allClients = await getClientRoster();

  return (
    <main className="page">
      <header className="page-header page-header-center">
        <div className="container-wide">
          <div className="crumb">— OUR VALUED CLIENTS</div>
          <div className="title">
            <h1 className="hd-display">A roster built over <i>fifteen years.</i></h1>
          </div>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container-wide">
          <div className="client-logos-grid">
            {allClients.map((c) => (
              <Link
                key={c.slug}
                href={`/clients/${c.slug}`}
                className={`client-logo-cell${c.logoUrl ? '' : ' is-text'}`}
                title={c.name}
                aria-label={c.name}
              >
                {c.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logoUrl} alt={c.name} />
                ) : (
                  <span className="cc-fallback-name">{c.name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
