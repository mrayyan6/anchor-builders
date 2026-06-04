import React from 'react';
import LoginForm from './LoginForm';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import '../admin/admin.css';

export const metadata = { title: 'Sign in — Anchor' };

export default async function LoginPage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    redirect(profile?.role === 'admin' ? '/admin' : '/');
  }

  const next = typeof searchParams?.next === 'string' ? searchParams.next : '';

  return (
    <main className="page login-page">
      <section className="login-shell">
        <div className="login-card">
          <div className="login-head">
            <span className="eyebrow"><span className="dot"></span>SIGN IN</span>
            <h1 className="hd-2" style={{ marginTop: 14 }}>Welcome back.</h1>
            <p className="body-md" style={{ marginTop: 10, color: 'var(--ink-3)' }}>
              Sign in to your Anchor account. Admins are taken straight to the project panel.
            </p>
          </div>
          <LoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
