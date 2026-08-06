'use client';

import { useEffect, useState, useRef } from 'react';
import { useCart } from '@/lib/cart-context';
import { useI18n } from '@/lib/i18n-context';
import { CheckCircle2, X } from 'lucide-react';

interface CartAddedToastProps {
  onOpenCart?: () => void;
}

export default function CartAddedToast({ onOpenCart }: CartAddedToastProps) {
  const { toast, hideToast } = useCart();
  const { dict, locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeToast, setActiveToast] = useState(toast);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    if (toast) {
      setActiveToast(toast);
      setIsVisible(true);
      startTimer();
    } else {
      setIsVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(hideToast, 300);
    }, 3500);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseEnter = () => clearTimer();
  const handleMouseLeave = () => {
    if (isVisible) startTimer();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(hideToast, 300);
  };

  if (!activeToast || !mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-8 left-0 right-0 mx-auto w-[90%] md:w-[28rem] md:bottom-10 md:left-auto md:right-10 z-[99999] transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 md:translate-y-0 md:translate-x-8 pointer-events-none'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-char border-2 border-sear rounded-xl shadow-2xl p-4 md:p-6 flex flex-col gap-3 md:gap-4">
        <div className="flex items-start gap-3 md:gap-4">
          <CheckCircle2 className="text-ember shrink-0 mt-0.5 md:mt-1 md:w-7 md:h-7" size={24} />
          
          <div className="flex-1 min-w-0">
            <p className="text-cream font-medium text-sm md:text-base leading-snug">
              <span className="font-semibold">{activeToast.item.name}</span> {dict.ui.menu.addedToCart}
            </p>
            {activeToast.cartQuantity > 1 && (
              <p className="text-cream-muted text-xs md:text-sm mt-1">
                {dict.ui.menu.quantity} <span className="font-ticket">{activeToast.cartQuantity}</span>
              </p>
            )}
            {activeToast.item.option && (
              <p className="text-cream-muted text-xs md:text-sm mt-1">
                {activeToast.item.option}
              </p>
            )}
          </div>

          <button 
            onClick={handleClose}
            className="text-cream-muted hover:text-cream transition-colors p-1 -mr-2 -mt-1 shrink-0"
            aria-label={dict.ui.menu.closeNotification}
          >
            <X size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        <div className="flex justify-end mt-1 md:mt-2">
          {onOpenCart ? (
            <button
              onClick={() => {
                handleClose();
                onOpenCart();
              }}
              className="text-xs md:text-sm font-ticket uppercase tracking-widest text-sear hover:text-sear/80 transition-colors"
            >
              {dict.ui.menu.viewCart}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
