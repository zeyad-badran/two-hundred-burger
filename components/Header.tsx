'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import CartDrawer from '@/components/CartDrawer';
import { useI18n } from '@/lib/i18n-context';
import CartAddedToast from '@/components/cart/CartAddedToast';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount, state: { isHydrated } } = useCart();
  const { locale, dict } = useI18n();
  const pathname = usePathname() || '/';

  const [isAnimating, setIsAnimating] = useState(false);
  const prevItemCountRef = useRef(itemCount);

  useEffect(() => {
    if (isHydrated && itemCount > prevItemCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevItemCountRef.current = itemCount;
      return () => clearTimeout(timer);
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount, isHydrated]);

  const switchLangUrl = locale === 'en' 
    ? `/ar${pathname === '/' ? '' : pathname}`
    : pathname.replace(/^\/ar/, '') || '/';

  const isDemo = process.env.NEXT_PUBLIC_SITE_MODE === 'demo';

  const NAV_LINKS = [
    { label: dict.ui.menu.eyebrow, href: '/#menu' },
    { label: dict.ui.about.eyebrow, href: '/#about' },
    { label: dict.ui.hero.viewMenu, href: '/#reviews' }, // Could use a "Reviews" dict key if added, but for now we'll just hardcode or reuse. Let's use English/Arabic directly here if no dict key for reviews yet.
    // Let's actually refine NAV_LINKS directly in render since we don't have all dictionary keys for them.
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {isDemo && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-sear/90 text-cream text-xs py-1.5 text-center font-medium backdrop-blur-sm">
          {locale === 'en' ? 'Demo Mode: All orders and payments are simulated.' : 'الوضع التجريبي: جميع الطلبات والمدفوعات وهمية.'}
        </div>
      )}
      <header
        className={`fixed ${isDemo ? 'top-[28px]' : 'top-0'} inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-char/90 backdrop-blur-md border-b border-char-line' : 'bg-transparent'
        }`}
      >
      <div className="container flex h-20 items-center justify-between">
        <a href="#top" className="font-display text-xl font-bold tracking-tight text-cream">
          Two<span className="text-sear">Hundred</span>Burger
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href={locale === 'ar' ? '/ar#menu' : '/#menu'} className="text-sm text-cream transition-colors hover:text-sear">
            {dict.ui.nav.menu}
          </a>
          <a href={locale === 'ar' ? '/ar#about' : '/#about'} className="text-sm text-cream transition-colors hover:text-sear">
            {dict.ui.nav.about}
          </a>
          <a href={locale === 'ar' ? '/ar#reviews' : '/#reviews'} className="text-sm text-cream transition-colors hover:text-sear">
            {dict.ui.nav.reviews}
          </a>
          <a href={locale === 'ar' ? '/ar#location' : '/#location'} className="text-sm text-cream transition-colors hover:text-sear">
            {dict.ui.nav.location}
          </a>
          <a href={locale === 'ar' ? '/ar#contact' : '/#contact'} className="text-sm text-cream transition-colors hover:text-sear">
            {dict.ui.nav.contact}
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            aria-label="Open cart"
            className="relative text-cream hover:text-sear transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={24} />
            {isHydrated && itemCount > 0 && (
              <span className={`absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-cream transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
                {itemCount}
              </span>
            )}
          </button>
          <a href={switchLangUrl} className="flex items-center gap-2 text-sm text-cream hover:text-sear transition-colors">
            <Globe size={18} />
            <span className="font-ticket uppercase tracking-widest">{locale === 'en' ? 'العربية' : 'EN'}</span>
          </a>
          <a href={dict.whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm">
              {dict.ui.hero.orderWhatsapp}
            </Button>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <a href={switchLangUrl} className="text-cream hover:text-sear transition-colors">
            <span className="font-ticket text-xs uppercase tracking-widest">{locale === 'en' ? 'ع' : 'EN'}</span>
          </a>
          <button
            aria-label="Open cart"
            className="relative text-cream"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={24} />
            {isHydrated && itemCount > 0 && (
              <span className={`absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-cream transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
                {itemCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            className="text-cream"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={`md:hidden fixed inset-0 z-40 bg-char/95 backdrop-blur-md pt-28 px-8 pb-6 flex flex-col overflow-y-auto ${isDemo ? 'top-[28px]' : ''}`}>
          <nav className="flex flex-col gap-8 text-3xl font-display mb-12">
            <a href={locale === 'ar' ? '/ar#top' : '/#top'} onClick={() => setOpen(false)} className="text-cream hover:text-sear transition-colors">
              {locale === 'en' ? 'Home' : 'الرئيسية'}
            </a>
            <a href={locale === 'ar' ? '/ar#menu' : '/#menu'} onClick={() => setOpen(false)} className="text-cream hover:text-sear transition-colors">
              {dict.ui.nav.menu}
            </a>
            <a href={locale === 'ar' ? '/ar#about' : '/#about'} onClick={() => setOpen(false)} className="text-cream hover:text-sear transition-colors">
              {dict.ui.nav.about}
            </a>
            <a href={locale === 'ar' ? '/ar#reviews' : '/#reviews'} onClick={() => setOpen(false)} className="text-cream hover:text-sear transition-colors">
              {dict.ui.nav.reviews}
            </a>
            <a href={locale === 'ar' ? '/ar#location' : '/#location'} onClick={() => setOpen(false)} className="text-cream hover:text-sear transition-colors">
              {dict.ui.nav.location}
            </a>
            <a href={locale === 'ar' ? '/ar#contact' : '/#contact'} onClick={() => setOpen(false)} className="text-cream hover:text-sear transition-colors">
              {dict.ui.nav.contact}
            </a>
          </nav>
          
          <div className="flex flex-col gap-4 mt-auto">
            <button
              onClick={() => { setOpen(false); setIsCartOpen(true); }}
              className="flex items-center justify-between py-4 border-t border-char-line text-xl text-cream"
            >
              <span>{dict.ui.cart.title}</span>
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} />
                {isHydrated && itemCount > 0 && (
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-ember text-xs font-bold text-cream transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
                    {itemCount}
                  </span>
                )}
              </div>
            </button>
            <a href={dict.whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <Button variant="whatsapp" className="w-full py-6 text-lg">
                {dict.ui.hero.orderWhatsapp}
              </Button>
            </a>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </header>
      <CartAddedToast onOpenCart={() => setIsCartOpen(true)} />
    </>
  );
}
