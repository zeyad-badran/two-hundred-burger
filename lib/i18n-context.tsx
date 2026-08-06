'use client';

import React, { createContext, useContext } from 'react';
import { siteConfigEn, siteConfigAr, menuItemsEn, menuItemsAr, reviewsEn, reviewsAr, type MenuItem, type Review } from './site-config';

export type Locale = 'en' | 'ar';
export type SiteConfig = typeof siteConfigEn;

interface I18nContextType {
  locale: Locale;
  dict: SiteConfig;
  menuItems: MenuItem[];
  reviews: Review[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const dict = locale === 'ar' ? siteConfigAr : siteConfigEn;
  const menuItems = locale === 'ar' ? menuItemsAr : menuItemsEn;
  const reviews = locale === 'ar' ? reviewsAr : reviewsEn;

  return (
    <I18nContext.Provider value={{ locale, dict, menuItems, reviews }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
