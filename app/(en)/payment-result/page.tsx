'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n-context';

type OrderState = {
  id: string;
  status: string;
  payment_status: string;
  customer_name: string;
  subtotal: number;
  branch_name?: string;
  delivery_address?: string;
  delivery_map_url?: string;
  delivery_distance_km?: number;
  delivery_fee?: number;
};

type NotificationState = {
  id: string;
  order_id: string;
  status: string;
  restaurant_phone: string;
  wa_link: string;
  message: string;
  created_at: string;
};

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState<OrderState | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const { dict, locale } = useI18n();

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.');
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);

        // Fetch restaurant notification if order is eligible
        const notifRes = await fetch(`/api/notifications/restaurant/${orderId}`, { cache: 'no-store' });
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          if (notifData.notification) {
            setNotification(notifData.notification);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-24 text-center">
          <p className="text-cream-muted">Loading order details...</p>
        </main>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-24 text-center">
          <div className="container max-w-md mx-auto">
            <h1 className="font-display text-3xl font-semibold text-ember mb-4">Error</h1>
            <p className="text-cream-muted mb-8">{error}</p>
            <Button onClick={() => router.push(locale === 'ar' ? '/ar' : '/')}>{dict.ui.paymentResult.returnHome}</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Derive UI state based on order status
  let title = 'Order Pending';
  let message = 'We are processing your order.';
  let titleColor = 'text-sear';

  if (order.payment_status === 'cash_on_delivery') {
    title = dict.ui.paymentResult.successTitle;
    message = locale === 'ar' ? `شكراً لك، ${order.customer_name}. جاري تجهيز طلبك. يرجى تحضير المبلغ نقداً عند الاستلام.` : `Thank you, ${order.customer_name}. We are preparing your order. Please have exact cash ready upon delivery.`;
    titleColor = 'text-green-500';
  } else if (order.status === 'paid' || order.status === 'preparing' || order.status === 'ready' || order.status === 'completed') {
    title = dict.ui.paymentResult.successTitle;
    message = locale === 'ar' ? `شكراً لك، ${order.customer_name}. تم الدفع بنجاح وجاري تجهيز طلبك.` : `Thank you, ${order.customer_name}. Your payment was successful and we are preparing your order.`;
    titleColor = 'text-green-500';
  } else if (order.status === 'payment_failed') {
    title = dict.ui.paymentResult.failureTitle;
    message = locale === 'ar' ? `عذراً ${order.customer_name}، حدثت مشكلة أثناء معالجة الدفع.` : `Sorry ${order.customer_name}, we couldn't process your payment.`;
    titleColor = 'text-ember';
  } else if (order.status === 'cancelled') {
    title = 'Order Cancelled';
    message = locale === 'ar' ? 'تم إلغاء الطلب.' : 'Your order has been cancelled.';
    titleColor = 'text-ember';
  }

  const whatsappMessage = encodeURIComponent(
    `Hello! I need help with order #${order.id}. My payment status is: ${order.payment_status || order.status}.`
  );

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 flex flex-col items-center text-center">
        <FadeIn className="container max-w-md mx-auto">
          <h1 className={`font-display text-4xl font-semibold mb-4 ${titleColor}`}>
            {title}
          </h1>
          <p className="text-cream-muted mb-8">{message}</p>
          
          <div className="bg-char-soft border border-char-line rounded-lg p-6 mb-8 text-left">
            <h3 className="font-display text-cream font-semibold border-b border-char-line pb-3 mb-3">
              Order Summary
            </h3>
            <div className="flex justify-between text-sm mb-2 text-cream-muted">
              <span>Order Number</span>
              <span className="font-mono text-xs">{order.id}</span>
            </div>
            {order.branch_name && (
              <div className="flex justify-between text-sm mb-2 text-cream-muted">
                <span>Branch</span>
                <span className="font-ticket">{order.branch_name}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 text-sm mb-2 text-cream-muted">
              <div className="flex justify-between">
                <span>Fulfillment</span>
                <span className="text-right">{order.delivery_address === 'Pickup' || !order.delivery_address ? 'Pickup' : order.delivery_address}</span>
              </div>
              {order.delivery_map_url && (
                <a href={order.delivery_map_url} target="_blank" rel="noopener noreferrer" className="text-sear text-right text-xs hover:underline">
                  View Map Location
                </a>
              )}
            </div>
            <div className="flex justify-between text-sm mb-2 text-cream-muted">
              <span>Subtotal</span>
              <span className="font-ticket text-cream">{order.subtotal.toFixed(2)} JOD</span>
            </div>
            {order.delivery_fee !== undefined && order.delivery_fee > 0 && (
              <div className="flex justify-between text-sm mb-2 text-cream-muted">
                <span>Delivery Fee</span>
                <span className="font-ticket text-cream">{order.delivery_fee.toFixed(2)} JOD</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-cream mt-2 pt-2 border-t border-char-line">
              <span>Total</span>
              <span className="font-ticket text-sear">{(order.subtotal + (order.delivery_fee || 0)).toFixed(2)} JOD</span>
            </div>
          </div>

          {/* Restaurant Notification Section */}
          <div className="bg-char-soft border border-char-line rounded-lg p-6 mb-8 text-left">
            <h3 className="font-display text-cream font-semibold border-b border-char-line pb-3 mb-3 flex justify-between items-center">
              <span>Restaurant Notification</span>
              <span className="text-xs text-cream-muted font-mono font-normal">Manual Mode</span>
            </h3>

            {notification ? (
              <div className="space-y-4">
                <p className="text-sm text-cream-muted">
                  Restaurant notification is ready to send to <strong className="text-cream">{notification.restaurant_phone}</strong>.
                </p>

                <a
                  href={notification.wa_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md text-center transition-colors text-sm"
                >
                  {dict.ui.paymentResult.sendWhatsapp}
                </a>

                <div className="relative mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-cream-muted">Message Preview:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(notification.message);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs text-sear hover:underline focus:outline-none"
                    >
                      {copied ? 'Copied!' : 'Copy Message'}
                    </button>
                  </div>
                  <pre className="w-full bg-char-dark border border-char-line rounded p-3 text-xs text-cream-muted overflow-x-auto whitespace-pre-wrap font-mono">
                    {notification.message}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-sm text-cream-muted">
                No restaurant notification was generated because the order was not confirmed.
              </p>
            )}
          </div>

          <div className="space-y-4">
            {order.status === 'payment_failed' ? (
              <>
                <Button 
                  className="w-full bg-sear text-char font-semibold hover:bg-sear/90" 
                  onClick={async () => {
                    setIsRetrying(true);
                    try {
                      const res = await fetch('/api/retry-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id }),
                      });
                      const data = await res.json();
                      if (data.redirectUrl) {
                        window.location.href = data.redirectUrl;
                      } else {
                        throw new Error(data.error || 'Failed to retry payment');
                      }
                    } catch (err: any) {
                      setError(err.message);
                      setIsRetrying(false);
                    }
                  }}
                  disabled={isRetrying}
                >
                  {isRetrying ? 'Loading...' : dict.ui.paymentResult.tryAgain}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push(locale === 'ar' ? '/ar' : '/')}>
                  {dict.ui.paymentResult.returnHome}
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => router.push(locale === 'ar' ? '/ar' : '/')}>
                {dict.ui.paymentResult.returnHome}
              </Button>
            )}
            <a
              href={`https://wa.me/${dict.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border border-char-line text-cream-muted hover:text-cream py-2 rounded transition-colors text-sm"
            >
              Contact Support on WhatsApp
            </a>
          </div>
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-24 text-center">Loading...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
