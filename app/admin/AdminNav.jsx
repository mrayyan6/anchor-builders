'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin',              label: 'Dashboard' },
  { href: '/admin/categories',   label: 'Categories' },
  { href: '/admin/projects',     label: 'Projects' },
];

export default function AdminNav() {
  const pathname = usePathname() || '/admin';
  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <nav className="admin-nav">
      {ITEMS.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`admin-nav-link${isActive(it.href) ? ' active' : ''}`}
        >
          {it.label}
        </Link>
      ))}
      <div className="admin-nav-divider" />
      <Link className="admin-nav-link subtle" href="/" target="_blank" rel="noopener">
        View site ↗
      </Link>
    </nav>
  );
}
