import React from 'react';
import './globals.css';
import AppShell from './AppShell';

export const metadata = {
  title: 'Anchor Associates & Builders — Construction & Contracting · Pakistan',
  description:
    'Anchor Associates & Builders — C-2 PEC registered construction firm based in Islamabad. Civil & MEP, prefabricated, agricultural, tensile, renovation and specialty construction across Pakistan.',
};

export default function RootLayout({ children }) {
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
