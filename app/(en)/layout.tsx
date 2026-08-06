import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import { siteConfigEn } from '@/lib/site-config';
import { CartProvider } from '@/lib/cart-context';
import { I18nProvider } from '@/lib/i18n-context';
import { FloatingLangSwitcher } from '@/components/FloatingLangSwitcher';

// Display font — warm, characterful serif for headlines
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
});

// Body font — clean and highly legible
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Ticket/mono font — used for prices, eyebrows, receipt-style labels
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

// =============================================================
// SEO METADATA
// Edit title/description/keywords here if the brand messaging changes.
// =============================================================
export const metadata: Metadata = {
  metadataBase: new URL(siteConfigEn.url),
  title: {
    default: `${siteConfigEn.name} | Premium Smash Burgers in Amman, Jordan`,
    template: `%s | ${siteConfigEn.name}`,
  },
  description: siteConfigEn.description,
  keywords: [
    'burger Amman',
    'best burger Jordan',
    'smash burger Amman',
    'Two Hundred Burger',
    'burger restaurant Amman',
    'crispy chicken burger Jordan',
    'burger delivery Amman',
    'fast food Amman',
  ],
  authors: [{ name: siteConfigEn.name }],
  creator: siteConfigEn.name,
  openGraph: {
    type: 'website',
    locale: siteConfigEn.locale,
    url: siteConfigEn.url,
    siteName: siteConfigEn.name,
    title: `${siteConfigEn.name} | Premium Smash Burgers in Amman, Jordan`,
    description: siteConfigEn.description,
    images: [
      {
        // TODO: replace with a real 1200x630 social share image at /public/images/og-cover.jpg
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfigEn.name} — premium burgers in Amman, Jordan`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfigEn.name} | Premium Smash Burgers in Amman, Jordan`,
    description: siteConfigEn.description,
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Local SEO signals for Amman, Jordan
  other: {
    'geo.region': 'JO-AM',
    'geo.placename': 'Amman',
  },
  icons: {
    // TODO: add a real favicon at /public/favicon.ico
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="bg-char-DEFAULT bg-char text-cream font-body">
        <I18nProvider locale="en">
          <CartProvider>
            {children}
            <FloatingLangSwitcher />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
