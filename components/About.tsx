'use client';

import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

export default function About() {
  const { dict } = useI18n();
  return (
    <section id="about" className="bg-char-soft py-24 md:py-32">
      <div className="container grid gap-14 md:grid-cols-2 md:items-center">
        <FadeIn className="relative aspect-[4/3] overflow-hidden rounded-lg border border-char-line">
          {/*
            Replace /public/images/restaurant-interior.jpg with a real photo
            of the kitchen or dining area once available.
          */}
          <Image
            src="/images/restaurant-interior.jpg"
            alt="Two Hundred Burger restaurant interior in Amman Jordan"
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="eyebrow">{dict.ui.about.eyebrow}</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {dict.ui.about.title}
          </h2>
          <div className="mt-6 space-y-4 text-cream-muted">
            <p>
              {dict.ui.about.subtitle}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
