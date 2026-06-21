'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import PasswordField from '../../src/PasswordField';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim() || !password || !confirm) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setBusy(false);

    // Do NOT surface the raw Supabase error — its text (e.g. "User already
    // registered") reveals whether an email exists (user enumeration). Show one
    // neutral message for both the error case and the "confirmation pending"
    // case so existing vs. new emails are indistinguishable. (Client-side
    // validation above still gives specific feedback for empty/short/mismatched
    // passwords, which are not enumeration leaks.)
    if (signUpErr || !data?.session) {
      setInfo('If this email is valid, check your inbox to continue.');
      return;
    }

    router.replace('/');
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
        autoComplete="new-password"
        required
      />

      <PasswordField
        label="Confirm password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        required
      />

      {error && <div className="form-error" role="alert">{error}</div>}
      {info && <div className="form-flash" role="status">{info}</div>}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={busy}
        style={{ alignSelf: 'flex-start' }}
      >
        <span>{busy ? 'Creating account…' : 'Create account'}</span>
        <span className="arr"></span>
      </button>

      <div className="auth-footer">
        Already have an account? <Link href="/login">Sign in</Link>
      </div>
    </form>
  );
}
