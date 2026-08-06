'use client';

import { MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function WhatsAppFloatButton() {
  const { dict } = useI18n();
  return (
    <a
      href={dict.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-char shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
    >
      <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
    </a>
  );
}
