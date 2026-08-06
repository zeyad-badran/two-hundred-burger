'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/FadeIn';
import { type MenuItem } from '@/lib/site-config';
import { useCart } from '@/lib/cart-context';
import { useI18n, SiteConfig } from '@/lib/i18n-context';

const CATEGORY_LABELS: Record<string, string> = {
  burgers: 'Burgers',
  sides: 'Sides',
  drinks: 'Drinks',
};

function MenuItemCard({ item, dict }: { item: MenuItem; dict: SiteConfig }) {
  const { locale } = useI18n();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(item.options && item.options.length > 0 ? item.options[0] : '');

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, option: selectedOption || undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="ticket-card group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-char-soft">
        {/*
          MENU IMAGES: Prioritizes Supabase uploaded image, then existing path, then fallback.
        */}
        <Image
          src={imgError ? '/images/classic-burger.jpg' : (item.image || '/images/classic-burger.jpg')}
          alt={item.image_alt || item.name}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        {item.tags && item.tags.length > 0 ? (
          <div className="absolute start-3 top-3 flex flex-col gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className={`rounded-full px-3 py-1 font-ticket text-[10px] uppercase tracking-widest shadow-md ${tag === 'Best Seller' || tag === 'الأكثر مبيعاً' ? 'bg-ember text-cream' : 'bg-sear text-char'}`}>
                {tag}
              </span>
            ))}
          </div>
        ) : (
          item.featured && (
            <span className="absolute start-3 top-3 rounded-full bg-ember px-3 py-1 font-ticket text-[10px] uppercase tracking-widest text-cream shadow-md">
              {dict.ui.tags['Best Seller']}
            </span>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-display text-lg font-semibold text-cream">
            {item.name}
          </h4>
          <span className="font-ticket text-sm text-sear whitespace-nowrap">
            {item.price} {dict.ui.menu.currency}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm text-cream-muted">{item.description}</p>

        {item.options && item.options.length > 0 && (
          <div className="mt-3">
            <select 
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full bg-char-soft text-sm border border-char-line rounded-md p-2 text-cream focus:outline-none focus:border-sear transition-colors"
            >
              {item.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <Button variant="outline" size="sm" className="w-full" onClick={handleAdd} disabled={added}>
            {added ? dict.ui.menu.added : dict.ui.menu.addToCart}
          </Button>
          <a
            href={`${dict.whatsappLink}?text=${encodeURIComponent(
              locale === 'ar' ? `مرحباً! أود طلب: ${item.name}` : `Hi! I'd like to order: ${item.name}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[11px] text-cream-muted hover:text-sear transition-colors"
          >
            {dict.ui.menu.orderWhatsapp}
          </a>
        </div>
      </div>
    </article>
  );
}

export default function MenuSection() {
  const { dict, menuItems: fallbackMenuItems, locale } = useI18n();
  const categories = ['burgers', 'sides', 'drinks'] as const;

  const [dbMenuItems, setDbMenuItems] = useState<MenuItem[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`/api/menu?locale=${locale}`);
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();
        setDbMenuItems(data);
      } catch (error) {
        console.error('Menu fetch failed, using fallback:', error);
      }
    }
    fetchMenu();
  }, [locale]);

  const displayItems = dbMenuItems || fallbackMenuItems;
  const featuredItems = displayItems.filter(item => item.featured);
  
  const filteredItems = displayItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' 
      ? true 
      : activeCategory === 'featured' 
        ? item.featured 
        : item.category === activeCategory;
        
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="menu" className="bg-char py-24 md:py-32">
      <div className="container">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{dict.ui.menu.eyebrow}</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold text-cream sm:text-5xl">
            {dict.ui.menu.title}
          </h2>
          <p className="mt-4 text-cream-muted">
            {dict.ui.menu.subtitle}
          </p>
        </FadeIn>

        {/* Search and Filters */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="w-full max-w-md relative flex items-center">
            <Search className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} text-cream-muted`} size={20} />
            <input 
              type="text" 
              placeholder={locale === 'en' ? 'Search menu...' : 'البحث في القائمة...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-char-soft border border-char-line rounded-full py-3 ${locale === 'ar' ? 'pr-12 pl-12' : 'pl-12 pr-12'} text-cream focus:outline-none focus:border-sear transition-colors`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute ${locale === 'ar' ? 'left-4' : 'right-4'} text-cream-muted hover:text-cream`}>
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveCategory('all')} 
              className={`px-4 py-2 rounded-full text-sm font-ticket tracking-wider transition-colors ${activeCategory === 'all' ? 'bg-sear text-char' : 'bg-char-soft text-cream hover:bg-char-line'}`}
            >
              {locale === 'en' ? 'All' : 'الكل'}
            </button>
            <button 
              onClick={() => setActiveCategory('featured')} 
              className={`px-4 py-2 rounded-full text-sm font-ticket tracking-wider transition-colors ${activeCategory === 'featured' ? 'bg-sear text-char' : 'bg-char-soft text-cream hover:bg-char-line'}`}
            >
              {dict.ui.offers.title}
            </button>
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)} 
                className={`px-4 py-2 rounded-full text-sm font-ticket tracking-wider transition-colors ${activeCategory === c ? 'bg-sear text-char' : 'bg-char-soft text-cream hover:bg-char-line'}`}
              >
                {dict.ui.categories[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section (only if viewing all and no search) */}
        {activeCategory === 'all' && !searchQuery && featuredItems.length > 0 && (
          <div className="mt-16 bg-char-soft rounded-3xl p-6 md:p-10 border border-char-line relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sear opacity-5 blur-[100px] rounded-full"></div>
            <FadeIn>
              <h3 className="font-display text-2xl font-bold text-sear">{dict.ui.offers.title}</h3>
              <p className="text-sm text-cream-muted mt-1">{dict.ui.offers.subtitle}</p>
            </FadeIn>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item, i) => (
                <FadeIn key={`featured-${item.id}`} delay={i * 0.06}>
                  <MenuItemCard item={item} dict={dict} />
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Categories or Filtered Results */}
        {activeCategory === 'all' && !searchQuery ? (
          categories.map((category, catIndex) => {
            const items = displayItems.filter((item) => item.category === category);
            if (items.length === 0) return null;
  
            return (
              <div key={category} className="mt-16">
                <FadeIn delay={catIndex * 0.05}>
                  <h3 className="font-ticket text-xs uppercase tracking-[0.3em] text-cream-dim">
                    {dict.ui.categories[category]}
                  </h3>
                </FadeIn>
  
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 0.06}>
                      <MenuItemCard item={item} dict={dict} />
                    </FadeIn>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="mt-16">
             {filteredItems.length === 0 ? (
               <div className="text-center text-cream-muted py-12">
                 {locale === 'en' ? 'No items found matching your search.' : 'لم يتم العثور على عناصر تطابق بحثك.'}
               </div>
             ) : (
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                 {filteredItems.map((item, i) => (
                   <FadeIn key={item.id} delay={i * 0.06}>
                     <MenuItemCard item={item} dict={dict} />
                   </FadeIn>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </section>
  );
}
