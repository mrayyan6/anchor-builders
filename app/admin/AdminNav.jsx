'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin',                label: 'Dashboard' },
  { href: '/admin/hero',           label: 'Hero' },
  { href: '/admin/categories',     label: 'Categories' },
  { href: '/admin/service-covers', label: 'Service covers' },
  { href: '/admin/projects',       label: 'Projects' },
  { href: '/admin/clients',        label: 'Clients' },
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
