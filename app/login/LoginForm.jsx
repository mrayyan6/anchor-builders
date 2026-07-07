'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import PasswordField from '../../src/PasswordField';

export default function LoginForm({ next }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInErr) {
      setBusy(false);
      // Neutral message — never surface provider/DB internals or reveal whether
      // the email exists (avoids account enumeration).
      setError('Sign-in failed. Please check your credentials and try again.');
      return;
    }

    // Decide where to send the user based on their profile role.
    // Reject external or protocol-relative URLs in the ?next= param (open redirect guard).
    const safeNext = typeof next === 'string' && /^\/(?!\/)/.test(next) ? next : '';
    let dest = safeNext || '/';
    try {
      const userId = data?.user?.id;
      if (userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        if (!safeNext) {
          dest = profile?.role === 'admin' ? '/admin' : '/';
        }
      }
    } catch {
      // ignore — fall back to default destination
    }

    setBusy(false);
    router.replace(dest);
    router.refresh();
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <div className="field">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <PasswordField
        label="Password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        required
      />

      {error && <div className="form-error" role="alert">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={busy}
        style={{ alignSelf: 'flex-start' }}
      >
        <span>{busy ? 'Signing in…' : 'Sign in'}</span>
        <span className="arr"></span>
      </button>

    </form>
  );
}
