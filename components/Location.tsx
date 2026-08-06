'use client';

import { Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

export default function Location() {
  const { dict } = useI18n();

  return (
    <section id="location" className="bg-char py-24 md:py-32">
      <div className="container grid gap-14 md:grid-cols-2 md:items-start">
        <FadeIn>
          <p className="eyebrow">{dict.ui.location.eyebrow}</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {dict.ui.location.title}
          </h2>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 shrink-0 text-sear" size={20} />
              <a href={dict.address.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-sear transition-colors">
                <p className="text-cream font-medium">{dict.address.line1}</p>
                <p className="text-cream-muted text-sm">{dict.address.line2}</p>
              </a>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="mt-1 shrink-0 text-sear" size={20} />
              <div className="flex-1 space-y-2">
                {dict.hours.map((hourSet) => (
                  <div key={hourSet.days} className="flex flex-col sm:flex-row justify-between border-b border-char-line pb-2 last:border-0 last:pb-0">
                    <span className="text-cream-muted">{hourSet.days}</span>
                    <span className="text-cream">{hourSet.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 shrink-0 text-sear" size={20} />
              <a href={dict.phoneHref} className="text-cream-muted hover:text-sear">
                {dict.phoneDisplay}
              </a>
            </div>
          </div>

          <a href={dict.whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg" className="mt-9">
              {dict.ui.hero.orderWhatsapp}
            </Button>
          </a>
        </FadeIn>

        <FadeIn delay={0.15} className="overflow-hidden rounded-lg border border-char-line">
          <iframe
            title="Restaurant Location"
            src={dict.address.mapEmbedSrc}
            width="100%"
            height="420"
            style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </FadeIn>
      </div>
    </section>
  );
}
