import type { Metadata } from 'next';
import { Inter, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import '../../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ticket',
});

export const metadata: Metadata = {
  title: 'Kitchen Dashboard | Two Hundred Burger',
  description: 'Order management dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function KitchenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="bg-char-DEFAULT bg-char text-cream font-body">
        {children}
      </body>
    </html>
  );
}
