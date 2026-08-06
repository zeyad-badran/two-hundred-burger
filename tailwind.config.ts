import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // === BRAND TOKENS ===
        // "Char" — the near-black warm charcoal used as the base background.
        char: {
          DEFAULT: '#14100E',
          soft: '#1C1613',
          surface: '#231C18',
          line: '#332924',
        },
        // "Ember" — the deep smoked-red accent (used sparingly, for heat/urgency).
        ember: {
          DEFAULT: '#C1440E',
          dark: '#8A3009',
          light: '#E2621F',
        },
        // "Sear" — the warm mustard/amber accent (primary CTA + highlight color).
        sear: {
          DEFAULT: '#E8A33D',
          dark: '#C4842A',
          light: '#F3C56C',
        },
        // "Cream" — off-white text color, warmer than pure white on dark bg.
        cream: {
          DEFAULT: '#F3EAE0',
          muted: '#B8A99A',
          dim: '#8A7B6E',
        },
      },
      fontFamily: {
        // Display face: Fraunces — warm, characterful serif for headlines.
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        // Body face: Inter — clean, highly legible for paragraphs/UI.
        body: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Mono/ticket face: used for prices, eyebrows, receipt-style labels.
        ticket: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'grill-lines':
          'repeating-linear-gradient(115deg, rgba(243,234,224,0.035) 0px, rgba(243,234,224,0.035) 1px, transparent 1px, transparent 14px)',
        'ember-fade':
          'linear-gradient(90deg, transparent 0%, #E8A33D 20%, #C1440E 50%, #E8A33D 80%, transparent 100%)',
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(0,0,0,0.6)',
        'card-hover': '0 20px 45px -15px rgba(193,68,14,0.35)',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        flicker: 'flicker 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
