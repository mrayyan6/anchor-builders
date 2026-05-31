import React from 'react';
import SignupForm from './SignupForm';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Create an account — Anchor' };

export default async function SignupPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/');

  return (
    <main className="page login-page">
      <section className="login-shell">
        <div className="login-card">
          <div className="login-head">
            <span className="eyebrow"><span className="dot"></span>CREATE ACCOUNT</span>
            <h1 className="hd-2" style={{ marginTop: 14 }}>Join Anchor.</h1>
            <p className="body-md" style={{ marginTop: 10, color: 'var(--ink-3)' }}>
              Create your account to track your projects and stay in touch with our team.
            </p>
          </div>
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
