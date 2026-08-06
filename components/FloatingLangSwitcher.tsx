'use client';

import { Globe } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';
import Link from 'next/link';
import { Suspense } from 'react';

function SwitcherInner() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Do not show on admin or kitchen routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/kitchen')) {
    return null;
  }

  // Create the alternate path
  let switchPath = pathname || '/';
  if (locale === 'en') {
    switchPath = `/ar${pathname === '/' ? '' : pathname}`;
  } else {
    switchPath = pathname.replace(/^\/ar/, '') || '/';
  }
  
  const search = searchParams?.toString();
  const switchUrl = search ? `${switchPath}?${search}` : switchPath;

  // On English (LTR), place on bottom-left. On Arabic (RTL), place on bottom-right (left visually).
  const positionClass = locale === 'en' ? 'bottom-6 left-6' : 'bottom-6 right-6';

  return (
    <div className={`fixed ${positionClass} z-40 md:hidden`}>
      <Link href={switchUrl} className="flex items-center justify-center w-12 h-12 bg-char-soft border border-char-line rounded-full shadow-lg text-cream hover:text-sear transition-colors">
        <Globe size={18} className="absolute opacity-20" />
        <span className="font-ticket font-bold text-sm uppercase tracking-widest z-10">{locale === 'en' ? 'ع' : 'EN'}</span>
      </Link>
    </div>
  );
}

export function FloatingLangSwitcher() {
  return (
    <Suspense fallback={null}>
      <SwitcherInner />
    </Suspense>
  );
}
