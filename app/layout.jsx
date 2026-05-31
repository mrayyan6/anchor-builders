import React from 'react';
import './globals.css';
import AppShell from './AppShell';
import { createClient } from '../utils/supabase/server';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell auth={auth}>{children}</AppShell>
      </body>
    </html>
  );
}
