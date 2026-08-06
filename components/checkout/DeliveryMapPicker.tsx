'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// Fix leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DeliveryMapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  locale?: string;
  defaultLat?: number;
  defaultLng?: number;
}

// Map event hook to capture clicks
function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function DeliveryMapPicker({ onLocationSelect, locale = 'en', defaultLat = 31.9539, defaultLng = 35.9106 }: DeliveryMapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError(locale === 'en' ? 'Geolocation is not supported by your browser' : 'المتصفح الخاص بك لا يدعم تحديد الموقع');
      return;
    }
    
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
        setPosition(latlng);
        onLocationSelect(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        let msgEn = 'Unable to retrieve your location.';
        let msgAr = 'تعذر تحديد موقعك.';
        
        if (error.code === error.PERMISSION_DENIED) {
           msgEn = 'Location access denied. Please allow location access in your iPhone/Browser settings or pin the location manually.';
           msgAr = 'تم رفض الوصول إلى الموقع. يرجى السماح بالوصول في إعدادات جهازك/المتصفح أو تحديد الموقع يدوياً.';
        } else if (error.code === error.TIMEOUT) {
           msgEn = 'Location request timed out. Please try again or pin manually.';
           msgAr = 'انتهى وقت طلب الموقع. يرجى المحاولة مرة أخرى أو التحديد يدوياً.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
           msgEn = 'Location information is unavailable on your device.';
           msgAr = 'معلومات الموقع غير متوفرة على جهازك.';
        }
        
        setGeoError(locale === 'en' ? msgEn : msgAr);
        setShowModal(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-ticket tracking-widest text-cream-muted uppercase">
          {locale === 'en' ? 'Pin your delivery location' : 'حدد موقع التوصيل على الخريطة'}
        </label>
        <Button type="button" variant="outline" size="sm" onClick={handleGeolocation} className="h-8 text-xs flex items-center gap-2">
          <Navigation size={14} />
          {locale === 'en' ? 'Use current location' : 'استخدام موقعي الحالي'}
        </Button>
      </div>

      {geoError && <p className="text-ember text-sm">{geoError}</p>}

      <div className="w-full h-[300px] rounded-lg overflow-hidden border border-char-line relative z-0">
        <MapContainer 
          center={[defaultLat, defaultLng]} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>
      
      {position && (
        <div className="flex items-center gap-2 text-sm text-sear bg-char-soft p-3 rounded-md border border-char-line">
          <MapPin size={16} />
          <span>
            {locale === 'en' ? 'Location selected' : 'تم تحديد الموقع'}: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </span>
        </div>
      )}

      {showModal && geoError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-char/80 px-4 backdrop-blur-sm">
          <div className="bg-char border border-char-line rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-ember/10 flex items-center justify-center mb-4">
              <Navigation className="text-ember" size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-cream mb-2">
              {locale === 'en' ? 'Location Access' : 'الوصول إلى الموقع'}
            </h3>
            <div className="text-cream-muted text-sm leading-relaxed mb-6 text-center space-y-3">
              <p>{geoError}</p>
              <div className="bg-char-soft p-3 rounded-lg border border-char-line text-left text-xs dir-ltr">
                <p className="font-semibold text-cream mb-1">How to fix on iPhone:</p>
                <ol className="list-decimal list-inside space-y-1 text-cream-muted/90">
                  <li>Open iPhone <b>Settings</b> app</li>
                  <li>Scroll down to <b>Safari</b></li>
                  <li>Tap <b>Location</b></li>
                  <li>Select <b>Ask</b> or <b>Allow</b></li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
            <Button 
              type="button"
              variant="primary" 
              className="w-full" 
              onClick={() => setShowModal(false)}
            >
              {locale === 'en' ? 'Okay' : 'حسناً'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
