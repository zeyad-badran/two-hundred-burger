'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroVideoShowcase() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if the user is on a desktop device
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      window.removeEventListener('resize', checkDesktop);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const floatingIdle = {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5
    }
  };

  // If reduced motion is active, we don't float.
  const animationVariants = prefersReducedMotion ? {} : floatingIdle;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-char">
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <motion.div animate={animationVariants} className="relative w-full h-full">
          
          {(!isDesktop || prefersReducedMotion || videoFailed) ? (
            <Image
              src="/images/hero/hero-burger-poster.webp"
              alt="Premium Burger Combo"
              fill
              priority
              className="object-cover"
              onError={() => {
                // Fallback to the original AI generated image if poster is missing
                const img = document.getElementById('hero-poster') as HTMLImageElement;
                if (img) img.src = "/images/hero/hero-combo-fallback.png";
              }}
              id="hero-poster"
            />
          ) : (
            <video 
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/images/hero/hero-burger-poster.webp"
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-[48%] -translate-y-[52%] scale-[1.08]"
              onError={() => setVideoFailed(true)}
            >
              <source src="/videos/PixVerse_V6_Image_Text_720P_Use_the_attached_p.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
            </video>
          )}

        </motion.div>
      </motion.div>
    </div>
  );
}
