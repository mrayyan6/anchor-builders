'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Nav, SiteFooter } from '../src/components';
import { PageTransition } from '../src/animations';

export default function AppShell({ children }) {
  const pathname = usePathname() || '/';

  // Transparent nav on the home hero and individual project detail pages
  const transparent =
    pathname === '/' || /^\/projects\/[^/]+$/.test(pathname);

  // slide hover style for client cards; black accent block on hover
  useEffect(() => {
    document.body.setAttribute('data-hover-style', 'slide');
    document.body.style.setProperty('--accent', '#14110d');
  }, []);

  return (
    <>
      <PageTransition routeKey={pathname} />
      <Nav transparent={transparent} />
      {children}
      <SiteFooter />
    </>
  );
}
