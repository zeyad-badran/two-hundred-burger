'use client';

import { Star, Quote } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

export default function Reviews() {
  const { reviews, dict } = useI18n();
  return (
    <section id="reviews" className="bg-char-soft py-24 md:py-32">
      <div className="container">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{dict.ui.reviews.eyebrow}</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {dict.ui.reviews.title}
          </h2>
          <p className="mt-4 text-sm text-cream-dim">{dict.ui.reviews.demoNote}</p>
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <FadeIn key={review.name} delay={i * 0.08}>
              <blockquote className="ticket-card h-full p-6">
                <Quote className="text-sear/40" size={28} />
                <div className="mt-4 flex text-sear">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s < review.rating ? 'currentColor' : 'none'}
                      strokeWidth={s < review.rating ? 0 : 1.5}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cream-muted">&ldquo;{review.text}&rdquo;</p>
                <footer className="mt-5 font-ticket text-xs uppercase tracking-wider text-cream-dim">
                  {review.name}
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>

        {/*
          Placeholder note: these are demo reviews. Once approved, replace
          with real customer reviews (with permission) in lib/site-config.ts.
        */}
      </div>
    </section>
  );
}
