'use client';

import { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { branches } from '@/lib/branches';
import { calculateDistanceKm, isWithinDeliveryRadius } from '@/lib/delivery/distance';
import { calculateDeliveryFee } from '@/lib/delivery/fees';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

const DeliveryMapPicker = dynamic(() => import('@/components/checkout/DeliveryMapPicker'), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-char-soft animate-pulse rounded-lg border border-char-line flex items-center justify-center text-cream-muted">جاري تحميل الخريطة...</div>
});

export default function CheckoutPage() {
  const { state, subtotal, clearCart } = useCart();
  const router = useRouter();
  const { dict, locale } = useI18n();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    fulfillment: 'delivery' as 'delivery' | 'pickup',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{name?: string, phone?: string, address?: string, map?: string, general?: string}>({});
  const [success, setSuccess] = useState(false);
  const [branchId, setBranchId] = useState<string>(branches[0].id);
  const [deliveryLat, setDeliveryLat] = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number | null>(null);

  // Derived state for delivery distance and fee
  const selectedBranchConfig = branches.find((b) => b.id === branchId);
  const deliveryDistance =
    formData.fulfillment === 'delivery' && deliveryLat !== null && deliveryLng !== null && selectedBranchConfig
      ? calculateDistanceKm(
          selectedBranchConfig.latitude,
          selectedBranchConfig.longitude,
          deliveryLat,
          deliveryLng
        )
      : null;

  const isDeliveryInRange =
    deliveryDistance !== null && selectedBranchConfig
      ? isWithinDeliveryRadius(deliveryDistance, selectedBranchConfig.delivery_radius_km)
      : null;

  const deliveryFee =
    isDeliveryInRange && selectedBranchConfig && deliveryDistance !== null
      ? calculateDeliveryFee(deliveryDistance, subtotal, selectedBranchConfig)
      : 0;

  const finalTotal = subtotal + (formData.fulfillment === 'delivery' ? deliveryFee : 0);

  // If the user lands here with an empty cart
  if (state.isHydrated && state.items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-24 text-center">
          <div className="container max-w-md mx-auto">
            <h1 className="font-display text-3xl font-semibold text-cream mb-4">{dict.ui.cart.empty}</h1>
            <p className="text-cream-muted mb-8">{dict.ui.cart.emptyDesc}</p>
            <Button onClick={() => router.push(locale === 'ar' ? '/ar#menu' : '/#menu')}>{dict.ui.checkout.backToMenu}</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    let hasError = false;
    const newErrors: {name?: string, phone?: string, address?: string, map?: string, general?: string} = {};

    if (!formData.name.trim() || /\d/.test(formData.name)) {
      newErrors.name = 'الرجاء إدخال اسم صحيح (لا يمكن أن يحتوي على أرقام).';
      hasError = true;
    }

    if (!/^(962|07)\d+$/.test(formData.phone)) {
      newErrors.phone = 'الرجاء إدخال رقم هاتف صحيح يبدأ بـ 962 أو 07 (مثال: 0791234567).';
      hasError = true;
    }

    if (formData.fulfillment === 'delivery') {
      if (!formData.address.trim()) {
        newErrors.address = 'يرجى إدخال عنوان التوصيل.';
        hasError = true;
      }
      if (deliveryLat === null && deliveryLng === null) {
        newErrors.map = 'يرجى تحديد موقع التوصيل على الخريطة.';
        hasError = true;
      } else if (isDeliveryInRange === false) {
        newErrors.general = dict.ui.checkout.outsideRadius;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      setIsSubmitting(false);
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-ember');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    try {
      const selectedBranch = branches.find(b => b.id === branchId);
      const deliveryMapUrl = formData.fulfillment === 'delivery' && deliveryLat && deliveryLng 
        ? `https://www.google.com/maps/search/?api=1&query=${deliveryLat},${deliveryLng}` 
        : null;

      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        fulfillment: formData.fulfillment,
        deliveryAddress: formData.address,
        deliveryLat: deliveryLat,
        deliveryLng: deliveryLng,
        deliveryMapUrl: deliveryMapUrl,
        branchId: branchId,
        branchName: selectedBranch?.name_ar || selectedBranch?.name_en || '',
        branchAddress: selectedBranch?.address_ar || selectedBranch?.address_en || '',
        notes: formData.notes,
        paymentMethod: paymentMethod,
        items: state.items.map(i => ({ id: i.id, quantity: i.quantity, option: i.option })),
        subtotal: subtotal
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      clearCart();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL provided');
      }
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24">
        <div className="container max-w-lg mx-auto">
          <FadeIn>
            <h1 className="font-display text-3xl font-semibold text-cream mb-8">{dict.ui.checkout.title}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="bg-char-soft p-6 md:p-8 rounded-3xl border border-char-line space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-cream mb-6">
                    نوع الطلب
                  </h2>
                  <div className="flex gap-4 mb-8">
                    <label className={`flex-1 flex items-center justify-center p-4 border rounded-md cursor-pointer transition-colors ${formData.fulfillment === 'delivery' ? 'border-sear bg-char-soft text-cream' : 'border-char-line text-cream-muted hover:border-cream-muted'}`}>
                      <input type="radio" name="fulfillment" value="delivery" checked={formData.fulfillment === 'delivery'} onChange={() => setFormData({ ...formData, fulfillment: 'delivery', address: '' })} className="sr-only" />
                      <span className="font-medium">توصيل</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center p-4 border rounded-md cursor-pointer transition-colors ${formData.fulfillment === 'pickup' ? 'border-sear bg-char-soft text-cream' : 'border-char-line text-cream-muted hover:border-cream-muted'}`}>
                      <input type="radio" name="fulfillment" value="pickup" checked={formData.fulfillment === 'pickup'} onChange={() => setFormData({ ...formData, fulfillment: 'pickup', address: 'Pickup' })} className="sr-only" />
                      <span className="font-medium">استلام من الفرع</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-semibold text-cream mb-6">اختر الفرع</h2>
                  <div className="space-y-4">
                  {branches.map((branch) => (
                    <label
                      key={branch.id}
                      className={`flex flex-col p-4 rounded-xl cursor-pointer transition-colors border ${
                        branchId === branch.id
                          ? 'bg-sear/10 border-sear text-cream'
                          : 'bg-char border-char-line text-cream-muted hover:bg-char-hover'
                      } ${!branch.is_active && 'opacity-50 cursor-not-allowed'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${branchId === branch.id ? 'border-sear' : 'border-char-line'}`}>
                          {branchId === branch.id && <div className="w-2.5 h-2.5 rounded-full bg-sear" />}
                        </div>
                        <div>
                          <span className="font-ticket uppercase tracking-widest">{branch.name_ar}</span>
                          <p className="text-sm mt-1">{branch.address_ar}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="branch"
                        value={branch.id}
                        checked={branchId === branch.id}
                        onChange={(e) => branch.is_active && setBranchId(e.target.value)}
                        disabled={!branch.is_active}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-cream-muted">
                  {dict.ui.checkout.fullName}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-md border bg-char-soft px-4 py-3 text-cream focus:outline-none focus:ring-1 ${errors.name ? 'border-ember focus:border-ember focus:ring-ember' : 'border-char-line focus:border-sear focus:ring-sear'}`}
                  placeholder={dict.ui.checkout.fullName}
                />
              {errors.name && <p className="text-ember text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-cream-muted">
                  {dict.ui.checkout.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full rounded-md border bg-char-soft px-4 py-3 text-cream focus:outline-none focus:ring-1 ${errors.phone ? 'border-ember focus:border-ember focus:ring-ember' : 'border-char-line focus:border-sear focus:ring-sear'}`}
                  placeholder={dict.ui.checkout.phonePlaceholder}
                />
              {errors.phone && <p className="text-ember text-sm mt-1">{errors.phone}</p>}
              </div>

              {formData.fulfillment === 'delivery' && (
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-cream-muted">
                    {dict.ui.checkout.address}
                  </label>
                  <textarea
                    id="address"
                    rows={2}
                    placeholder={dict.ui.checkout.addressPlaceholder}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full rounded-md border bg-char p-3 text-cream placeholder-cream-muted/50 focus:outline-none ${errors.address ? 'border-ember focus:border-ember' : 'border-char-line focus:border-sear'}`}
                  />
                  {errors.address && <p className="text-ember text-sm mt-1">{errors.address}</p>}
                  <div className="pt-2">
                    <DeliveryMapPicker 
                      locale="ar" 
                      onLocationSelect={(lat, lng) => {
                        setDeliveryLat(lat);
                        setDeliveryLng(lng);
                        setErrors(prev => ({ ...prev, map: undefined }));
                      }} 
                    />
                    {errors.map && <p className="text-ember text-sm mt-1">{errors.map}</p>}

                    {deliveryDistance !== null && selectedBranchConfig && (
                      <div className={`mt-4 p-4 rounded-lg border ${isDeliveryInRange ? 'border-sear/30 bg-sear/5' : 'border-ember/30 bg-ember/5'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-cream-muted">{dict.ui.checkout.distanceFromBranch}:</span>
                          <span className="font-ticket text-cream font-sans dir-ltr">{deliveryDistance.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-cream-muted">{dict.ui.checkout.deliveryRadius}:</span>
                          <span className="font-ticket text-cream font-sans dir-ltr">{selectedBranchConfig.delivery_radius_km} km</span>
                        </div>
                        {isDeliveryInRange ? (
                          <>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-cream-muted">{dict.ui.checkout.deliveryFee}:</span>
                              <span className="font-ticket text-sear font-sans dir-ltr">{deliveryFee.toFixed(2)} {dict.ui.cart.currency}</span>
                            </div>
                            <p className="text-xs text-sear flex items-center gap-1">
                              <CheckCircle2 size={14} /> {dict.ui.checkout.deliveryAvailable}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-ember flex items-start gap-1 mt-3">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" /> 
                            {dict.ui.checkout.outsideRadius}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium text-cream-muted">
                  {dict.ui.checkout.notes}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-md border border-char-line bg-char-soft px-4 py-3 text-cream focus:border-sear focus:outline-none focus:ring-1 focus:ring-sear"
                  placeholder={dict.ui.checkout.notesPlaceholder}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-cream-muted mb-2">
                  {dict.ui.checkout.paymentMethod}
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-sear bg-char-soft text-cream' : 'border-char-line text-cream-muted hover:border-cream-muted'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')} 
                      className="sr-only" 
                    />
                    <span className="font-medium text-center">{dict.ui.checkout.payCardDemo}</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-sear bg-char-soft text-cream' : 'border-char-line text-cream-muted hover:border-cream-muted'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      checked={paymentMethod === 'cash'} 
                      onChange={() => setPaymentMethod('cash')} 
                      className="sr-only" 
                    />
                    <span className="font-medium text-center">{dict.ui.checkout.cashOnDelivery}</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-char-line pt-6">
                <ul className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <li key={`${item.id}-${item.option || 'default'}`} className="flex items-start justify-between gap-4 text-sm">
                      <div className="flex gap-3">
                        <span className="font-ticket text-sear">{item.quantity}x</span>
                        <div>
                          <span className="text-cream block">{item.name}</span>
                          {item.option && <span className="text-cream-muted text-xs block">{item.option}</span>}
                        </div>
                      </div>
                      <span className="font-ticket text-cream-muted shrink-0">
                        {(Number(item.price) * item.quantity).toFixed(2)} {dict.ui.cart.currency}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-display text-cream">{dict.ui.checkout.subtotal}</span>
                  <span className="font-ticket text-cream font-sans dir-ltr">{subtotal.toFixed(2)} {dict.ui.cart.currency}</span>
                </div>
                {formData.fulfillment === 'delivery' && (
                  <div className="flex justify-between items-center mb-3 text-cream-muted">
                    <span className="font-display">{dict.ui.checkout.deliveryFee}</span>
                    <span className="font-ticket font-sans dir-ltr">{deliveryFee.toFixed(2)} {dict.ui.cart.currency}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-6 pt-3 border-t border-char-line">
                  <span className="font-display text-lg text-cream">{dict.ui.checkout.total}</span>
                  <span className="font-ticket text-xl text-sear font-sans dir-ltr">{finalTotal.toFixed(2)} {dict.ui.cart.currency}</span>
                </div>

                {errors.general && <p className="text-ember text-sm mb-4">{errors.general}</p>}

                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting || (formData.fulfillment === 'delivery' && isDeliveryInRange === false)}>
                  {isSubmitting ? dict.ui.checkout.processing : dict.ui.checkout.placeOrder}
                </Button>
              </div>

            </form>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
