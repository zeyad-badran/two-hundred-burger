'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-char text-cream flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-display font-bold mb-4">404</h1>
      <p className="text-xl text-cream-muted mb-8">Page not found | الصفحة غير موجودة</p>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Link href="/" className="px-6 py-3 bg-sear text-char font-semibold rounded-md hover:bg-sear/90 transition-colors">
          Return Home (English)
        </Link>
        <Link href="/ar" className="px-6 py-3 bg-char-soft text-cream font-semibold rounded-md hover:bg-char-hover transition-colors border border-char-line">
          العودة للرئيسية (عربي)
        </Link>
      </div>
    </div>
  );
}
