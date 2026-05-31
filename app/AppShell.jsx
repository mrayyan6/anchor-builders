'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Nav, SiteFooter } from '../src/components';
import { PageTransition } from '../src/animations';

export default function AppShell({ children, auth = null }) {
  const pathname = usePathname() || '/';

  // Admin, login & signup routes provide their own chrome — don't double-wrap.
  const isStandalone =
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup';

  // Transparent nav on the home hero and the new slug-based project detail
  // pages (/projects/[categorySlug]/[projectSlug]).
  const transparent =
    pathname === '/' || /^\/projects\/[^/]+\/[^/]+$/.test(pathname);

  // slide hover style for client cards; black accent block on hover
  useEffect(() => {
    document.body.setAttribute('data-hover-style', 'slide');
    document.body.style.setProperty('--accent', '#14110d');
  }, []);

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <PageTransition routeKey={pathname} />
      <Nav transparent={transparent} auth={auth} />
      {children}
      <SiteFooter />
    </>
  );
}
