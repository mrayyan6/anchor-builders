import React from 'react';
import LoginForm from './LoginForm';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Sign in — Anchor' };

export default async function LoginPage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/admin');

  const next = typeof searchParams?.next === 'string' ? searchParams.next : '/admin';

  return (
    <main className="page login-page">
      <section className="login-shell">
        <div className="login-card">
          <div className="login-head">
            <span className="eyebrow"><span className="dot"></span>ADMIN ACCESS</span>
            <h1 className="hd-2" style={{ marginTop: 14 }}>Sign in to manage projects.</h1>
            <p className="body-md" style={{ marginTop: 10, color: 'var(--ink-3)' }}>
              Use your Anchor admin credentials. Customer accounts cannot access the admin panel.
            </p>
          </div>
          <LoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
