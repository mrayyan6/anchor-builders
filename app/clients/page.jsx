import React from 'react';
import Link from 'next/link';
import { CTABlock } from '../../src/components';
import { getClientRoster } from '../../lib/queries';

export const dynamic = 'force-dynamic';

function getClientGridSpanClass(index, total) {
  const remainder = total % 4;
  const fromEnd = total - 1 - index;

  if (remainder === 1 && fromEnd === 0) return 'client-span-full';
  if (remainder === 2 && fromEnd < 2) return 'client-span-half';
  return '';
}
function logoMaxWidth(name) {
  const n = name.length;
  if (n <= 4)  return 1000;
  if (n <= 7)  return 720;
  if (n <= 11) return 600;
  if (n <= 15) return 500;
  return 420;
}

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
          <div className="clients-grid">
            {allClients.map((c, i) => {
              const spanClass = getClientGridSpanClass(i, allClients.length);
              const maxW = logoMaxWidth(c.name);
              return (
                <Link key={c.slug} href={`/clients/${c.slug}`} className={`client-card${spanClass ? ` ${spanClass}` : ''}`}>
                  <span className="cc-arrow">↗</span>
                  {c.logoUrl && (
                    <img
                      src={c.logoUrl}
                      alt=""
                      className="cc-logo"
                      style={{ maxWidth: maxW }}
                    />
                  )}
                  <div className="cc-name-wrap">
                    <h3 className="cc-name">{c.name}</h3>
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
