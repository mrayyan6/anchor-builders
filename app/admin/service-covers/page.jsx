import React from 'react';
import { SITE_DATA } from '../../../src/data';
import { getServiceCovers } from '../../../lib/queries';
import { createClient } from '../../../utils/supabase/server';
import ServiceCoversClient from './ServiceCoversClient';

export const dynamic = 'force-dynamic';

export default async function ServiceCoversPage() {
  // Cover overrides (with storage paths for clean replace/remove).
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('service_covers')
    .select('service_id, image_url, image_storage_path');
  const byId = {};
  if (Array.isArray(rows)) for (const r of rows) byId[r.service_id] = r;

  const services = SITE_DATA.SERVICES.map((s) => ({
    id: s.id,
    number: s.number,
    name: s.name,
    fallback: s.hero,
    image_url: byId[s.id]?.image_url || null,
    image_storage_path: byId[s.id]?.image_storage_path || null,
  }));

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="crumb">— ADMIN / SERVICE COVERS</div>
        <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div>
            <h1 className="hd-2">Service cover images</h1>
            <p className="body-md" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              The cover image shown for each service across the site. Upload to override the default; remove to fall back.
            </p>
          </div>
        </div>
      </header>

      <ServiceCoversClient initial={services} />
    </div>
  );
}
