import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MenuSection from '@/components/Menu';
import About from '@/components/About';
import WhyChooseUs from '@/components/WhyChooseUs';
import Reviews from '@/components/Reviews';
import Location from '@/components/Location';
import Franchise from '@/components/Franchise';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { siteConfigAr } from '@/lib/site-config';

export default function Home() {
  // Structured data (JSON-LD) — helps Google understand this is a local
  // restaurant in Amman. Edit values here if hours/address/phone change.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: siteConfigAr.name,
    description: siteConfigAr.description,
    servesCuisine: 'Burgers',
    priceRange: 'JOD 1 - JOD 10',
    telephone: siteConfigAr.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfigAr.address.line1,
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    url: `${siteConfigAr.url}/ar`,
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <About />
        <WhyChooseUs />
        <Reviews />
        <Location />
        <Franchise />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
