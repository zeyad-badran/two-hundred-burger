'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroVideoShowcase from '@/components/hero/HeroVideoShowcase';
import { useI18n } from '@/lib/i18n-context';

export default function Hero() {
  const { dict, locale } = useI18n();
  
  // Split the tagline to match the 3-line design
  const taglineLines = dict.tagline.split('.').map(s => s.trim()).filter(Boolean);
  return (
    <section id="top" className="relative overflow-hidden bg-char pt-32 pb-20 md:pt-44 md:pb-28 min-h-[90vh] flex items-center">
      
      {/* FULL BACKGROUND VIDEO SHOWCASE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <HeroVideoShowcase />
        {/* Overlays for text readability */}
        <div className={`absolute inset-0 ${locale === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-char/90 via-char/60 to-transparent`} />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative z-10 max-w-2xl mx-0">
        <div className="pr-4 md:pr-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
          >
            <span className="h-px w-8 bg-sear" />
            <a href={dict.address.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-sear transition-colors">
              {dict.address.line1}
            </a>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-balance font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-[4.2rem]"
          >
            {taglineLines[0]}
            {taglineLines.length > 1 && <>.<br />{taglineLines[1]}</>}
            {taglineLines.length > 2 && <>.<br /><span className="text-sear">{taglineLines[2]}.</span></>}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-lg text-cream font-medium drop-shadow-md"
          >
            {dict.description.replace('نسخة تجريبية. ', '').replace('Demo website concept built as a proposal. ', '')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a href="#menu">
              <Button size="lg">{dict.ui.hero.viewMenu}</Button>
            </a>
            <a href={dict.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg">
                {dict.ui.hero.orderWhatsapp}
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-char-line bg-char-surface px-4 py-2"
          >
            <div className="flex text-sear">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <span className="text-sm text-cream-muted">
              {dict.ui.hero.ratingText}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
