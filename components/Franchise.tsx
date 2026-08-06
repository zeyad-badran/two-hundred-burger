'use client';

import { UtensilsCrossed, PartyPopper, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

export default function Franchise() {
  const { dict, locale } = useI18n();

  const OPPORTUNITIES = [
    {
      icon: UtensilsCrossed,
      title: dict.ui.franchise.opportunities.catering.title,
      description: dict.ui.franchise.opportunities.catering.description,
    },
    {
      icon: PartyPopper,
      title: dict.ui.franchise.opportunities.events.title,
      description: dict.ui.franchise.opportunities.events.description,
    },
    {
      icon: Store,
      title: dict.ui.franchise.opportunities.franchise.title,
      description: dict.ui.franchise.opportunities.franchise.description,
    },
  ];

  return (
    <section id="franchise" className="bg-char-soft py-24 md:py-32">
      <div className="container">
        <FadeIn className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-char-soft text-sear">
            <Store size={32} />
          </div>
          <h2 className="text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {dict.ui.franchise.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-muted">
            {dict.ui.franchise.subtitle}
          </p>
          <div className="mt-10">
            <a href="mailto:pending@owner-setup.com" className="inline-block">
              <Button size="lg" variant="outline" className="border-char-line hover:bg-char-soft hover:text-sear">
                {dict.ui.franchise.button}
              </Button>
            </a>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {OPPORTUNITIES.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="h-full rounded-lg border border-char-line bg-char p-7 text-center">
                <item.icon className="mx-auto text-sear" size={30} strokeWidth={1.6} />
                <h3 className="mt-4 font-display text-lg font-semibold text-cream">{item.title}</h3>
                <p className="mt-2 text-sm text-cream-muted">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-12 text-center">
          <a href={locale === 'ar' ? '/ar#contact' : '/#contact'}>
            <Button size="lg">{dict.ui.franchise.button}</Button>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
