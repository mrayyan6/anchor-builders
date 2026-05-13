import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <section className="page-header">
        <div className="container-wide">
          <div className="crumb">— 404</div>
          <div className="title">
            <h1 className="hd-display">Not found.</h1>
            <p className="lede">
              The page you're looking for has moved or doesn't exist.{' '}
              <Link href="/" className="link-arrow" style={{ marginTop: 16, display: 'inline-flex' }}>Back home</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
