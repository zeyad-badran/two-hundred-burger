'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

export default function Contact() {
  const { dict, locale } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const whatsappUrl = `${dict.whatsappLink}?text=${whatsappPrefill}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  const whatsappPrefill = encodeURIComponent(
    locale === 'ar' 
      ? `مرحباً! اسمي ${name || '___'}.\nالهاتف: ${phone || '___'}\nالرسالة: ${message || '___'}`
      : `Hi! My name is ${name || '___'}.\nPhone: ${phone || '___'}\nMessage: ${message || '___'}`
  );

  return (
    <section id="contact" className="bg-char py-24 md:py-32">
      <div className="container grid gap-14 md:grid-cols-2">
        <FadeIn>
          <p className="eyebrow">{dict.ui.contact.eyebrow}</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {dict.ui.contact.title}
          </h2>
          <p className="mt-4 max-w-md text-cream-muted">
            {dict.ui.contact.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href={`${dict.whatsappLink}?text=${whatsappPrefill}`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp">
                {dict.ui.contact.whatsappBtn}
              </Button>
            </a>
            <a href={dict.phoneHref}>
              <Button size="lg" className="bg-char-soft text-cream border border-char-line hover:bg-char hover:border-sear">
                {dict.phoneDisplay}
              </Button>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          {sent ? (
            <div className="ticket-card flex h-full flex-col items-center justify-center p-10 text-center">
              <p className="font-display text-xl text-cream">{dict.ui.contact.thanksTitle.replace('{name}', name || 'friend')}</p>
              <p className="mt-2 text-sm text-cream-muted">
                {locale === 'ar' ? 'تم تجهيز رسالتك للواتساب.' : 'Your message has been prepared for WhatsApp.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ticket-card space-y-4 p-6 sm:p-8">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-wider text-cream-dim">
                  {dict.ui.contact.formName}
                </label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dict.ui.contact.formNamePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs uppercase tracking-wider text-cream-dim">
                  {dict.ui.contact.formPhone}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs uppercase tracking-wider text-cream-dim">
                  {dict.ui.contact.formMessage}
                </label>
                <Textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={dict.ui.contact.formMessagePlaceholder}
                />
              </div>

              <Button type="submit" className="w-full">
                {dict.ui.contact.formSubmit}
              </Button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
