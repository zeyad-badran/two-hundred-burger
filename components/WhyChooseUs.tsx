'use client';

import { Leaf, Flame, Timer, Star, Smartphone } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

export default function WhyChooseUs() {
  const { dict, locale } = useI18n();

  const FEATURES = [
    {
      icon: Leaf,
      title: locale === 'ar' ? 'مكونات طازجة' : 'Fresh ingredients',
      description: locale === 'ar' 
        ? 'نختار مكوناتنا بعناية لتجربة طعم مميزة.' 
        : 'Quality ingredients prepared for the best taste.',
    },
    {
      icon: Flame,
      title: locale === 'ar' ? 'سماش طازج' : 'Juicy, smashed-to-order',
      description: locale === 'ar' 
        ? 'كل قطعة لحم تُسحق على الصاج بعد طلبك مباشرة.' 
        : 'Every patty hits the grill only after you order, sealing in flavor.',
    },
    {
      icon: Timer,
      title: locale === 'ar' ? 'خدمة سريعة' : 'Fast, reliable service',
      description: locale === 'ar' 
        ? 'فريقنا مهتم بتقديم طلبك ساخناً وبأسرع وقت.' 
        : 'A kitchen focused on quality and speed for your convenience.',
    },
    {
      icon: Star,
      title: locale === 'ar' ? 'رضا العملاء' : 'Customer satisfaction',
      description: locale === 'ar' 
        ? 'محبوب من قبل زبائننا للطعم المتميز وحجم الوجبات.' 
        : 'Loved by our regulars for taste and portion size.',
    },
    {
      icon: Smartphone,
      title: locale === 'ar' ? 'سهولة الطلب' : 'Easy ordering',
      description: locale === 'ar' 
        ? 'اطلب مباشرة عبر واتساب بثوانٍ — بدون تطبيقات معقدة.' 
        : 'Order directly on WhatsApp in seconds — no app download, no hassle.',
    },
  ];

  return (
    <section className="bg-char py-24 md:py-32">
      <div className="container">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{locale === 'ar' ? 'لماذا تختارنا' : 'Why Two Hundred Burger'}</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {locale === 'ar' ? 'ما يجعلك تعود دائماً' : 'What keeps people coming back'}
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.06}>
              <div className="h-full rounded-lg border border-char-line bg-char-surface p-6 transition-colors hover:border-sear/40">
                <feature.icon className="text-sear" size={28} strokeWidth={1.6} />
                <h3 className="mt-4 font-display text-base font-semibold text-cream">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-cream-muted">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
