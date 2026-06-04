import React from 'react';
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AppShell from './AppShell';
import { createClient } from '../utils/supabase/server';

// Self-hosted, render-blocking-free font loading via next/font. Mirrors the
// previous Google Fonts <link> (same families/weights/styles) but eliminates
// the external fonts.googleapis.com + fonts.gstatic.com round-trips and adds
// automatic font-display: swap + size-adjust fallbacks (reduces FCP/LCP/CLS).
const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});
const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'Anchor Associates & Builders — Construction & Contracting · Pakistan',
  description:
    'Anchor Associates & Builders — C-2 PEC registered construction firm based in Islamabad. Civil & MEP, prefabricated, agricultural, tensile, renovation and specialty construction across Pakistan.',
};

async function getAuth() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return { email: user.email || '', role: profile?.role || 'customer' };
}

export default async function RootLayout({ children }) {
  const auth = await getAuth();

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <AppShell auth={auth}>{children}</AppShell>
      </body>
    </html>
  );
}
