'use client';

import { X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, removeItem, updateQuantity, subtotal } = useCart();
  const { dict, locale } = useI18n();
  const { items, isHydrated } = state;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-char/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="flex w-full max-w-2xl max-h-[85vh] flex-col bg-char border border-char-line shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-char-line p-6">
              <h2 className="font-display text-xl font-semibold text-cream">{dict.ui.cart.title}</h2>
              <button
                onClick={onClose}
                className="text-cream-muted hover:text-cream transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!isHydrated ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-cream-muted">{locale === 'en' ? 'Loading cart...' : 'جاري تحميل السلة...'}</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-full bg-char-soft p-4">
                    <Trash2 className="h-8 w-8 text-cream-muted" />
                  </div>
                  <p className="text-cream-muted">{dict.ui.cart.empty}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose();
                      window.location.href = locale === 'ar' ? '/ar#menu' : '/#menu';
                    }}
                  >
                    {dict.ui.checkout.backToMenu}
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.option || 'default'}`} className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border border-char-line shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-sm font-semibold text-cream line-clamp-2">
                            {item.name} {item.option && <span className="text-cream-muted text-xs block font-sans">{item.option}</span>}
                          </h3>
                          <span className="font-ticket text-sm text-sear whitespace-nowrap">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} {dict.ui.cart.currency}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 rounded-md border border-char-line p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.option)}
                              className="text-cream-muted hover:text-cream transition-colors p-1"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-ticket text-sm text-cream min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.option)}
                              className="text-cream-muted hover:text-cream transition-colors p-1"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.option)}
                            className="text-cream-muted hover:text-ember transition-colors p-1"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {isHydrated && items.length > 0 && (
              <div className="border-t border-char-line p-6 bg-char-surface">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-cream-muted">{dict.ui.cart.subtotal}</span>
                  <span className="font-ticket text-lg text-cream font-semibold font-sans dir-ltr">
                    {subtotal.toFixed(2)} {dict.ui.cart.currency}
                  </span>
                </div>
                {/* Phase 2: Checkout Button enabled */}
                <Link href={locale === 'ar' ? '/ar/checkout' : '/checkout'} onClick={onClose} className="block w-full">
                  <Button variant="primary" className="w-full">
                    {dict.ui.cart.checkout}
                  </Button>
                </Link>
              </div>
            )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
