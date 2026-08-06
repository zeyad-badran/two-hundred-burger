import type { Metadata } from 'next';
import { Inter, Fraunces, IBM_Plex_Mono, Cairo } from 'next/font/google';
import '../../globals.css';
import { siteConfigAr } from '@/lib/site-config';
import { CartProvider } from '@/lib/cart-context';
import { I18nProvider } from '@/lib/i18n-context';
import { FloatingLangSwitcher } from '@/components/FloatingLangSwitcher';

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

const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfigAr.url),
  title: {
    default: `${siteConfigAr.name} | برغر سماش فاخر في عمّان، الأردن`,
    template: `%s | ${siteConfigAr.name}`,
  },
  description: siteConfigAr.description,
  keywords: [
    'برغر عمان',
    'أفضل برغر الأردن',
    'سماش برغر عمان',
    'Two Hundred Burger',
    'مطعم برغر عمان',
    'دجاج مقرمش الأردن',
    'توصيل برغر عمان',
    'وجبات سريعة عمان',
  ],
  authors: [{ name: siteConfigAr.name }],
  creator: siteConfigAr.name,
  openGraph: {
    type: 'website',
    locale: siteConfigAr.locale,
    url: siteConfigAr.url,
    siteName: siteConfigAr.name,
    title: `${siteConfigAr.name} | برغر سماش فاخر في عمّان، الأردن`,
    description: siteConfigAr.description,
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfigAr.name} — برغر فاخر في عمّان، الأردن`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfigAr.name} | برغر سماش فاخر في عمّان، الأردن`,
    description: siteConfigAr.description,
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'geo.region': 'JO-AM',
    'geo.placename': 'عمّان',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayoutAr({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} ${cairo.variable}`}>
      <body className="bg-char-DEFAULT bg-char text-cream font-arabic">
        <I18nProvider locale="ar">
          <CartProvider>
            {children}
            <FloatingLangSwitcher />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
