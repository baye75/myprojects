import type { Metadata } from 'next';

import './globals.css';
import { Providers } from './providers';

/**
 * Metadata exported from a layout or page becomes real <head> tags in the
 * HTML the server sends. That is what Google, WhatsApp and Twitter read —
 * something a plain client-side SPA cannot do without extra machinery.
 */
export const metadata: Metadata = {
  title: {
    default: 'TaskFlow',
    template: '%s · TaskFlow',
  },
  description: 'A small, real task board. Built on Day 4 of the IoTBTech React Deep Dive.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
