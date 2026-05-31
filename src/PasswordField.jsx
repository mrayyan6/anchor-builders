'use client';
import React, { useState } from 'react';

/**
 * Reusable password input with a show/hide eye toggle.
 * Mirrors the field styling used elsewhere in the site forms.
 */
export default function PasswordField({
  label = 'Password',
  value,
  onChange,
  autoComplete = 'current-password',
  required = false,
  disabled = false,
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="field password-field">
      <label>{label}</label>
      <div className="password-input-wrap">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? 'Hide password' : 'Show password'}
          disabled={disabled}
        >
          {shown ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}

function Eye() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a18.7 18.7 0 0 1 4.22-5.06" />
      <path d="M9.9 4.24A9.6 9.6 0 0 1 12 4c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.07 4.07" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}
