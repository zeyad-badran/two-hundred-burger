/**
 * =============================================================
 *  TWO HUNDRED BURGER — SITE CONFIG
 * =============================================================
 * This file is the SINGLE PLACE to edit:
 *   - Restaurant name, phone number, WhatsApp number
 *   - Opening hours
 *   - Location / map
 *   - Menu items, descriptions, prices (JOD)
 *   - Image file paths
 *
 * You do NOT need to touch any component file to update content —
 * just edit the values below and the whole site updates.
 * =============================================================
 */

export const siteConfigEn = {
  name: 'Two Hundred Burger',
  shortName: '200 Burger',
  tagline: 'Crafted Burgers. Bold Flavor. Made Fresh.',
  description:
    'Demo website concept built as a proposal. Serving premium smash burgers, crispy chicken, and loaded fries in Amman, Jordan. Not the official website.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://two-hundred-burger.vercel.app',
  locale: 'en_US',

  // === CONTACT — change these to the real numbers ===
  phoneDisplay: '+962 79 000 0000 (Demo)', 
  phoneHref: 'tel:+962790000000', 
  whatsappNumber: '962790000000',
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber}`;
  },

  // === LOCATION — replace with the real address + map embed ===
  address: {
    line1: 'The Abdali Boulevard',
    line2: 'Amman, Jordan',
    mapLink: 'https://www.google.com/maps/search/Two+Hundred+Burger+Amman',
    mapEmbedSrc: 'https://maps.google.com/maps?q=Two+Hundred+Burger,+Amman,+Jordan&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },

  // === OPENING HOURS — placeholder, replace with real hours ===
  hours: [
    { days: 'Sunday – Thursday', time: '12:00 PM – 12:00 AM (Pending Confirmation)' },
    { days: 'Friday – Saturday', time: '1:00 PM – 1:00 AM (Pending Confirmation)' },
  ],

  social: {
    instagram: 'https://instagram.com/', // (Pending Owner Setup)
    facebook: 'https://facebook.com/', // (Pending Owner Setup)
    tiktok: 'https://tiktok.com/', // (Pending Owner Setup)
  },
  
  // Dictionary for component UI strings
  ui: {
    hero: {
      viewMenu: 'View the Menu',
      orderWhatsapp: 'Order via WhatsApp',
      ratingText: 'Sample Rating (Demo)',
    },
    offers: {
      title: 'Featured Offers',
      subtitle: 'Hand-picked for you',
    },
    menu: {
      eyebrow: 'The Menu',
      title: 'Every item, made to order',
      subtitle: 'Prices shown in Jordanian Dinar (JOD). Swap any patty, add extra sauce, or go double — just ask.',
      addToCart: 'Add to Cart',
      added: 'Added to Cart ✓',
      addedToCart: 'added to your cart',
      viewCart: 'View Cart',
      quantity: '— quantity:',
      closeNotification: 'Close notification',
      orderWhatsapp: 'or order on WhatsApp',
      currency: 'JOD',
    },
    cart: {
      title: 'Your Order',
      empty: 'Your cart is empty',
      emptyDesc: 'Add items from the menu before continuing to checkout.',
      subtotal: 'Subtotal',
      checkout: 'Checkout',
      currency: 'JOD',
    },
    categories: {
      burgers: 'Burgers',
      sides: 'Sides',
      drinks: 'Drinks',
    },
    tags: {
      'Popular': 'Popular',
      'Best Seller': 'Best Seller',
      'Crispy': 'Crispy',
    },
    about: {
      eyebrow: 'Quality Commitment',
      title: 'No compromises.',
      subtitle: 'Every patty is smashed to order on a screaming-hot griddle to get those perfectly crispy edges and juicy center.',
      feature1Title: 'Premium Beef',
      feature1Desc: 'High-quality beef, ground fresh.',
      feature2Title: 'Crispy Edges',
      feature2Desc: 'Smashed on a 400°F griddle for maximum flavor.',
      feature3Title: 'Daily Brioche',
      feature3Desc: 'Freshly baked and butter-toasted for every order.',
    },
    location: {
      eyebrow: 'Find Us',
      title: 'Visit us in Amman',
    },
    franchise: {
      title: 'Catering, events & franchising',
      subtitle: 'Interested in catering or business inquiries? This section can be customized after owner approval.',
      button: 'Contact Us',
      opportunities: {
        catering: {
          title: 'Catering',
          description: 'Burger platters and bulk orders for offices, meetings, and private gatherings.',
        },
        events: {
          title: 'Events',
          description: 'On-site or pop-up service for weddings, birthdays, and corporate events.',
        },
        franchise: {
          title: 'Franchise Inquiries',
          description: 'Interested in bringing Two Hundred Burger to your city? Let’s talk.',
        },
      }
    },
    nav: {
      quickLinks: 'Quick Links',
      menu: 'Menu',
      about: 'About',
      reviews: 'Reviews',
      location: 'Location',
      contact: 'Contact',
    },
    reviews: {
      eyebrow: 'Customer Reviews',
      title: 'What they are saying',
      demoNote: 'Sample review presentation based on general public customer sentiment. Final quotations require owner approval.',
    },
    footer: {
      note: 'Note: Demo website concept built as a proposal. Brand assets and official details to be confirmed with owner. Not the official website.',
      copyright: 'Prototype website concept.',
    },
    checkout: {
      title: 'Checkout',
      backToMenu: 'Return to Menu',
      deliveryInfo: 'Delivery Information',
      fullName: 'Full Name',
      phone: 'Phone Number',
      phonePlaceholder: '079 123 4567',
      address: 'Delivery Address',
      addressPlaceholder: 'Street, Building, Apartment',
      pickupBranch: 'Select Pickup Branch',
      notes: 'Order Notes',
      notesPlaceholder: 'No onions, extra sauce on the side...',
      paymentMethod: 'Payment Method',
      payCardDemo: 'Pay by Card (Demo)',
      cashOnDelivery: 'Cash on Delivery',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      distanceFromBranch: 'Distance from branch',
      deliveryRadius: 'Delivery radius',
      deliveryAvailable: 'Delivery is available to this location.',
      outsideRadius: 'Sorry, this location is outside the selected branch’s delivery area. Move the map pin, choose another branch, or select pickup.',
    },
    paymentResult: {
      successTitle: 'Order Received!',
      successDesc: 'Restaurant notification is prepared (manual mode).',
      failureTitle: 'Payment Failed',
      failureDesc: 'There was an issue processing your mock payment.',
      whatsappReady: 'Restaurant notification is ready to send manually.',
      sendWhatsapp: 'Send WhatsApp to Restaurant',
      tryAgain: 'Try Again',
      returnHome: 'Return to Home',
    },
    contact: {
      eyebrow: 'Get in Touch',
      title: 'Questions, catering, or feedback?',
      subtitle: 'Send us a message and we\'ll get back to you shortly — or skip the form and message us directly on WhatsApp for a faster reply.',
      whatsappBtn: 'Message on WhatsApp',
      formName: 'Name',
      formNamePlaceholder: 'Your name',
      formPhone: 'Phone',
      formMessage: 'Message',
      formMessagePlaceholder: 'Tell us what you need...',
      formSubmit: 'Send Message',
      thanksTitle: 'Thanks, {name}!',
      thanksDesc: 'This is a demo form — in the live site, your message would be sent to the restaurant now.',
    }
  }
};

// === MENU ITEMS ===
// To add/remove/edit a menu item, just edit this array.
// `image` paths point to /public/images/ — see README.md for the
// exact list of images to add before launch.
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string; // in JOD, e.g. "4.50"
  image: string;
  image_alt?: string;
  category: 'burgers' | 'sides' | 'drinks';
  featured?: boolean;
  tags?: string[];
  options?: string[];
};

export const menuItemsEn: MenuItem[] = [
  {
    id: 'classic-burger',
    name: 'Classic Smash Burger',
    description: 'Premium beef patty smashed to perfection, melted cheddar, crisp lettuce, fresh tomato, and our signature house sauce on a toasted brioche bun.',
    price: '4.50', 
    image: '/images/classic-burger.jpg', 
    category: 'burgers',
    tags: ['Popular'],
  },
  {
    id: 'double-smash',
    name: 'Double Smash Burger',
    description: 'Two smashed premium beef patties, double melted cheddar, caramelized onions, and our secret smash sauce for the ultimate bold flavor.',
    price: '6.00',
    image: '/images/double-smash.jpg',
    category: 'burgers',
    featured: true,
    tags: ['Best Seller'],
  },
  {
    id: 'crispy-chicken',
    name: 'Crispy Chicken Burger',
    description: 'Golden buttermilk-fried chicken thigh, zesty pickles, and spicy mayo served in a soft, buttery toasted bun.',
    price: '5.00',
    image: '/images/crispy-chicken.jpg',
    category: 'burgers',
    tags: ['Crispy'],
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Fries',
    description: 'Crispy hand-cut fries smothered in melted cheddar cheese, signature smash sauce, and savory beef bits.',
    price: '3.25',
    image: '/images/loaded-fries.jpg',
    category: 'sides',
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    description: '6-piece tender chicken wings tossed in your choice of our house glaze, served with a creamy dipping sauce.',
    price: '4.00',
    image: '/images/wings.jpg',
    category: 'sides',
  },
  {
    id: 'soft-drinks',
    name: 'Soft Drinks',
    description: 'Pepsi, 7Up, Mirinda — ice cold, 330ml can.',
    price: '1.00',
    image: '/images/soft-drinks.jpg',
    category: 'drinks',
  },
];

// === CUSTOMER REVIEWS (placeholder names, paraphrased sentiment) ===
// Note: Review examples are paraphrased from public customer sentiment for demo purposes.
export type Review = {
  name: string;
  rating: number;
  text: string;
};

export const reviewsEn: Review[] = [
  {
    name: 'Ahmad A.',
    rating: 5,
    text: 'Absolutely incredible burgers! The patties are incredibly juicy with perfectly crispy edges. Best burger joint I’ve visited in Amman.',
  },
  {
    name: 'Sara M.',
    rating: 5,
    text: 'The service is so fast even when they are busy. The loaded fries are out of this world and the portions are great value.',
  },
  {
    name: 'Mohammad J.',
    rating: 4,
    text: 'A very clean place with a fantastic location in Amman. The crispy chicken is super crunchy and flavorful. Highly recommend!',
  },
];

// ============================================================================
// ARABIC TRANSLATIONS (RTL)
// ============================================================================

export const siteConfigAr = {
  name: 'Two Hundred Burger',
  shortName: '200 Burger',
  tagline: 'برغر محضّر بعناية. نكهة قوية. طازج كل يوم.',
  description:
    'نسخة تجريبية. نقدم برغر سماش فاخر، دجاج مقرمش، وبطاطا طازجة في عمّان، الأردن. ليس الموقع الرسمي.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://two-hundred-burger.vercel.app',
  locale: 'ar_JO',

  phoneDisplay: '+962 79 000 0000 (تجريبي)',
  phoneHref: 'tel:+962790000000',
  whatsappNumber: '962790000000',
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber}`;
  },

  address: {
    line1: 'العبدلي بوليفارد',
    line2: 'عمّان، الأردن',
    mapLink: 'https://www.google.com/maps/search/Two+Hundred+Burger+Amman',
    mapEmbedSrc: 'https://maps.google.com/maps?q=Two+Hundred+Burger,+Amman,+Jordan&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },

  hours: [
    { days: 'الأحد – الخميس', time: '12:00 م – 12:00 ص (بانتظار التأكيد)' },
    { days: 'الجمعة – السبت', time: '1:00 م – 1:00 ص (بانتظار التأكيد)' },
  ],

  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
  },

  // Dictionary for component UI strings
  ui: {
    hero: {
      viewMenu: 'تصفح القائمة',
      orderWhatsapp: 'اطلب عبر واتساب',
      ratingText: 'تقييم تجريبي كنموذج',
    },
    offers: {
      title: 'عروض مميزة',
      subtitle: 'اخترناها خصيصاً لك',
    },
    menu: {
      eyebrow: 'القائمة',
      title: 'كل صنف، يُحضّر عند الطلب',
      subtitle: 'الأسعار بالدينار الأردني (د.أ). يمكنك تبديل اللحمة، إضافة صوص، أو طلب دبل — فقط اطلب.',
      addToCart: 'أضف للسلة',
      added: 'تمت الإضافة ✓',
      addedToCart: 'تمت الإضافة إلى سلة الطلب',
      viewCart: 'عرض السلة',
      quantity: '— الكمية:',
      closeNotification: 'إغلاق الإشعار',
      orderWhatsapp: 'أو اطلب عبر واتساب',
      currency: 'د.أ',
    },
    cart: {
      title: 'طلبك',
      empty: 'سلة الطلب فارغة',
      emptyDesc: 'أضف أصنافاً من القائمة قبل المتابعة إلى إتمام الطلب.',
      subtotal: 'المجموع',
      checkout: 'إتمام الطلب',
      currency: 'د.أ',
    },
    categories: {
      burgers: 'البرغر',
      sides: 'الأطباق الجانبية',
      drinks: 'المشروبات',
    },
    tags: {
      'Popular': 'شائع',
      'Best Seller': 'الأكثر مبيعاً',
      'Crispy': 'مقرمش',
    },
    about: {
      eyebrow: 'التزامنا بالجودة',
      title: 'لا تنازلات.',
      subtitle: 'كل قرص لحم يُسحق على الصاج لطلبك، للحصول على تلك الحواف المقرمشة المثالية والعصارة الغنية.',
      feature1Title: 'لحم فاخر',
      feature1Desc: 'لحم بقري عالي الجودة ومفروم طازجاً.',
      feature2Title: 'حواف مقرمشة',
      feature2Desc: 'مسحوقة على صاج ساخن جداً لزيادة النكهة.',
      feature3Title: 'خبز بريوش يومي',
      feature3Desc: 'مخبوز طازج، ومحمص بالزبدة لكل طلب.',
    },
    location: {
      eyebrow: 'موقعنا',
      title: 'زورونا في عمّان',
    },
    franchise: {
      title: 'تجهيز الحفلات والفعاليات',
      subtitle: 'مهتم بخدمات الطعام أو الاستفسارات التجارية؟ هذا القسم يمكن تخصيصه بعد موافقة المالك.',
      button: 'اتصل بنا',
      opportunities: {
        catering: {
          title: 'الطلبات الخارجية',
          description: 'أطباق برغر وطلبات كبيرة للمكاتب، الاجتماعات، والتجمعات الخاصة.',
        },
        events: {
          title: 'الفعاليات',
          description: 'خدمة في الموقع أو أكشاك مؤقتة لحفلات الزفاف، أعياد الميلاد، ومناسبات الشركات.',
        },
        franchise: {
          title: 'استفسارات الامتياز',
          description: 'مهتم بفتح فرع 200 برغر في مدينتك؟ لنتحدث.',
        },
      }
    },
    nav: {
      quickLinks: 'روابط سريعة',
      menu: 'القائمة',
      about: 'عن المطعم',
      reviews: 'التقييمات',
      location: 'موقعنا',
      contact: 'اتصل بنا',
    },
    reviews: {
      eyebrow: 'التقييمات',
      title: 'آراء العملاء',
      demoNote: 'عرض تجريبي للمراجعات مبني على الانطباعات العامة للعملاء. الاقتباسات النهائية تحتاج إلى موافقة المالك.',
    },
    footer: {
      note: 'ملاحظة: هذه نسخة تجريبية مصممة كنموذج. العلامة التجارية والتفاصيل الرسمية قيد التأكيد مع المالك. ليس الموقع الرسمي.',
      copyright: 'نموذج تجريبي للموقع.',
    },
    checkout: {
      title: 'إتمام الطلب',
      backToMenu: 'العودة إلى القائمة',
      deliveryInfo: 'معلومات التوصيل',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      phonePlaceholder: '079 123 4567',
      address: 'العنوان بالتفصيل',
      addressPlaceholder: 'اسم الشارع، رقم العمارة، رقم الشقة',
      pickupBranch: 'اختر فرع الاستلام',
      notes: 'ملاحظات إضافية',
      notesPlaceholder: 'بدون بصل، صوص جانبي...',
      paymentMethod: 'طريقة الدفع',
      payCardDemo: 'دفع بالبطاقة (تجريبي)',
      cashOnDelivery: 'الدفع عند الاستلام',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      deliveryFee: 'رسوم التوصيل',
      total: 'المجموع الكلي',
      placeOrder: 'تأكيد الطلب',
      processing: 'جاري المعالجة...',
      distanceFromBranch: 'المسافة من الفرع',
      deliveryRadius: 'نطاق التوصيل',
      deliveryAvailable: 'التوصيل متاح لهذا الموقع.',
      outsideRadius: 'عذرًا، هذا الموقع خارج نطاق توصيل الفرع المحدد. حرّك الموقع على الخريطة أو اختر فرعًا آخر أو اختر الاستلام من الفرع.',
    },
    paymentResult: {
      successTitle: 'تم استلام الطلب!',
      successDesc: 'تم تجهيز إشعار المطعم (وضع يدوي).',
      failureTitle: 'فشل الدفع',
      failureDesc: 'حدثت مشكلة أثناء معالجة الدفع.',
      whatsappReady: 'رسالة واتساب جاهزة للإرسال إلى المطعم.',
      sendWhatsapp: 'إرسال رسالة واتساب للمطعم',
      tryAgain: 'حاول مرة أخرى',
      returnHome: 'العودة للرئيسية',
    },
    contact: {
      eyebrow: 'تواصل معنا',
      title: 'أسئلة، طلبات خارجية، أو اقتراحات؟',
      subtitle: 'أرسل لنا رسالة وسنرد عليك قريباً — أو تجاوز النموذج وراسلنا مباشرة على واتساب للرد السريع.',
      whatsappBtn: 'راسلنا على واتساب',
      formName: 'الاسم',
      formNamePlaceholder: 'اسمك الكريم',
      formPhone: 'رقم الهاتف',
      formMessage: 'الرسالة',
      formMessagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
      formSubmit: 'إرسال الرسالة',
      thanksTitle: 'شكراً، {name}!',
      thanksDesc: 'هذا نموذج تجريبي — في الموقع الفعلي، سيتم إرسال رسالتك إلى المطعم الآن.',
    }
  }
};

export const menuItemsAr: MenuItem[] = [
  {
    id: 'classic-burger',
    name: 'برغر كلاسيك سماش',
    description: 'قرص لحم ممتاز مسحوق بإتقان، جبنة شيدر ذائبة، خس مقرمش، طماطم طازجة، وصوصنا الخاص في خبز بريوش محمص.',
    price: '4.50', 
    image: '/images/classic-burger.jpg',
    category: 'burgers',
    tags: ['شائع'],
  },
  {
    id: 'double-smash',
    name: 'دبل سماش برغر',
    description: 'قرصين من اللحم الممتاز، شيدر مضاعف، بصل مكرمل، وصوص السماش السري لنكهة قوية لا تُقاوم.',
    price: '6.00',
    image: '/images/double-smash.jpg',
    category: 'burgers',
    featured: true,
    tags: ['الأكثر مبيعاً'],
  },
  {
    id: 'crispy-chicken',
    name: 'برغر دجاج مقرمش',
    description: 'فخذ دجاج مقرمش متبل بالحليب الرائب، مخلل، ومايونيز حار يقدم في خبز طري محمص بالزبدة.',
    price: '5.00',
    image: '/images/crispy-chicken.jpg',
    category: 'burgers',
    tags: ['مقرمش'],
  },
  {
    id: 'loaded-fries',
    name: 'بطاطا محمّلة',
    description: 'بطاطا مقرمشة مغطاة بصوص السماش، جبنة شيدر ذائبة، وقطع اللحم اللذيذة.',
    price: '3.25',
    image: '/images/loaded-fries.jpg',
    category: 'sides',
  },
  {
    id: 'chicken-wings',
    name: 'أجنحة دجاج',
    description: '6 قطع من أجنحة الدجاج الطرية بصوص المطعم الخاص، تقدم مع صوص للتغميس.',
    price: '4.00',
    image: '/images/wings.jpg',
    category: 'sides',
  },
  {
    id: 'soft-drinks',
    name: 'مشروبات غازية',
    description: 'بيبسي، سفن أب، ميرندا — باردة جداً، عبوة 330 مل.',
    price: '1.00',
    image: '/images/soft-drinks.jpg',
    category: 'drinks',
  },
];

export const reviewsAr: Review[] = [
  {
    name: 'أحمد ع.',
    rating: 5,
    text: 'برغر لا يُصدق! اللحمة غنية بالعصارة مع حواف مقرمشة ومثالية. أفضل مطعم برغر زرته في عمّان.',
  },
  {
    name: 'سارة م.',
    rating: 5,
    text: 'الخدمة سريعة جداً حتى وقت الذروة. البطاطا المحملة خيالية والكميات ممتازة مقابل السعر.',
  },
  {
    name: 'محمد ج.',
    rating: 4,
    text: 'مكان نظيف جداً وموقعه رائع في عمّان. دجاج الكرسبي مقرمش ومليء بالنكهة. أنصح به بشدة!',
  },
];


