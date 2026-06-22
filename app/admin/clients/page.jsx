import React from 'react';
import { getAllClients } from '../../../lib/queries';
import ClientsAdminClient from './ClientsAdminClient';

export const dynamic = 'force-dynamic';

export default async function ClientsAdminPage() {
  const clients = await getAllClients();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">— ADMIN / CLIENTS</div>
        <h1 className="hd-2">Clients</h1>
        <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
          Edit client details — full name, sector, partner-since year, total
          project count, and the testimonial shown on the client page.
        </p>
        {clients.length === 0 && (
          <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
            No clients found. Run <span className="mono">supabase/clients.sql</span> in
            Supabase to create and seed the clients table.
          </p>
        )}
      </header>

      <ClientsAdminClient initial={clients} />
    </div>
  );
}
