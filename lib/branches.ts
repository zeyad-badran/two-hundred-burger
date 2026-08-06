export type Branch = {
  id: string;
  name_en: string;
  name_ar: string;
  address_en: string;
  address_ar: string;
  phone: string;
  whatsapp: string;
  google_maps_url: string;
  
  // Delivery Rules (DEMO VALUES REQUIRING OWNER CONFIRMATION)
  latitude: number;
  longitude: number;
  delivery_radius_km: number;
  base_delivery_fee: number;
  included_distance_km: number;
  fee_per_extra_km: number;
  minimum_delivery_fee: number;
  
  is_active: boolean;
};

export const branches: Branch[] = [
  {
    id: 'abdali-main',
    name_en: 'Abdali Boulevard (Main)',
    name_ar: 'العبدلي بوليفارد (الرئيسي)',
    address_en: 'The Abdali Boulevard, Amman, Jordan',
    address_ar: 'العبدلي بوليفارد، عمان، الأردن',
    phone: '+962 79 000 0000 (Pending)',
    whatsapp: '962790000000',
    google_maps_url: 'https://maps.google.com/maps?q=Two+Hundred+Burger,+Amman,+Jordan',
    
    // DEMO VALUES REQUIRING OWNER CONFIRMATION
    latitude: 31.9632,
    longitude: 35.9016,
    delivery_radius_km: 10,
    base_delivery_fee: 1.00,
    included_distance_km: 2,
    fee_per_extra_km: 0.25,
    minimum_delivery_fee: 1.00,
    
    is_active: true,
  },
  {
    id: 'sweifieh-village',
    name_en: 'Sweifieh Village (Demo)',
    name_ar: 'قرية الصويفية (تجريبي)',
    address_en: 'Sweifieh Village, Amman, Jordan',
    address_ar: 'قرية الصويفية، عمان، الأردن',
    phone: '+962 79 000 0001 (Pending)',
    whatsapp: '962790000001',
    google_maps_url: 'https://maps.google.com/maps?q=Sweifieh+Village,+Amman,+Jordan',
    
    // DEMO VALUES REQUIRING OWNER CONFIRMATION
    latitude: 31.9539,
    longitude: 35.8566,
    delivery_radius_km: 10,
    base_delivery_fee: 1.00,
    included_distance_km: 2,
    fee_per_extra_km: 0.25,
    minimum_delivery_fee: 1.00,
    
    is_active: true,
  }
];
