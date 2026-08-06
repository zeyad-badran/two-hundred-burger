'use client';

import { Instagram, Facebook, Music2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n-context';

export default function Footer() {
  const { dict, locale } = useI18n();
  return (
    <footer className="border-t border-char-line bg-char-soft py-14">
      <div className="container grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-cream">
            Two<span className="text-sear">Hundred</span>Burger
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream-muted">
            {dict.ui.footer.note}
          </p>
          {/* Social links — replace with real profile URLs in lib/site-config.ts */}
          <div className="mt-5 flex gap-4 text-cream-muted">
            <a href={dict.social.instagram} className="hover:text-sear" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href={dict.social.facebook} className="hover:text-sear" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href={dict.social.tiktok} className="hover:text-sear" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <Music2 size={20} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-ticket text-xs uppercase tracking-widest text-cream-dim">{dict.ui.nav.quickLinks}</p>
          <ul className="mt-4 space-y-2">
            <li><a href={locale === 'ar' ? '/ar#menu' : '/#menu'} className="text-sm text-cream-muted hover:text-sear">{dict.ui.nav.menu}</a></li>
            <li><a href={locale === 'ar' ? '/ar#about' : '/#about'} className="text-sm text-cream-muted hover:text-sear">{dict.ui.nav.about}</a></li>
            <li><a href={locale === 'ar' ? '/ar#reviews' : '/#reviews'} className="text-sm text-cream-muted hover:text-sear">{dict.ui.nav.reviews}</a></li>
            <li><a href={locale === 'ar' ? '/ar#location' : '/#location'} className="text-sm text-cream-muted hover:text-sear">{dict.ui.nav.location}</a></li>
            <li><a href={locale === 'ar' ? '/ar#contact' : '/#contact'} className="text-sm text-cream-muted hover:text-sear">{dict.ui.nav.contact}</a></li>
          </ul>
        </div>

        <div>
          <p className="font-ticket text-xs uppercase tracking-widest text-cream-dim">{dict.ui.nav.contact}</p>
          <ul className="mt-4 space-y-2 text-sm text-cream-muted">
            <li>
              <a href={dict.address.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-sear">
                {dict.address.line1}, {dict.address.line2}
              </a>
            </li>
            <li>
              <a href={dict.phoneHref} className="hover:text-sear">{dict.phoneDisplay}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-char-line pt-8 md:flex-row container">
        <p className="text-sm text-cream-dim text-center md:text-left">
          © {new Date().getFullYear()} {dict.name}. {dict.ui.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
