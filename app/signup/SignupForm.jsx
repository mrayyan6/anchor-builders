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

    if (signUpErr) {
      setError(signUpErr.message || 'Sign-up failed.');
      return;
    }

    // If email confirmation is required by the Supabase project, the session
    // will be null and the user needs to verify before signing in.
    if (!data?.session) {
      setInfo('Account created. Check your email to verify your address, then sign in.');
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
