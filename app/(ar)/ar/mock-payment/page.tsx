'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/FadeIn';
import { useI18n } from '@/lib/i18n-context';

function MockPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const token = searchParams.get('token');
  const { locale } = useI18n();

  const [isProcessing, setIsProcessing] = useState(false);

  if (!orderId || !token) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Session</h1>
          <p>Missing order ID or confirmation token.</p>
        </div>
      </main>
    );
  }

  const handleSimulate = async (result: 'success' | 'failed' | 'cancelled') => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/mock-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token, result }),
      });
      
      if (!res.ok) {
        throw new Error('Simulation failed on server.');
      }
      
      const redirectPath = locale === 'ar' ? `/ar/payment-result` : `/payment-result`;
      router.push(`${redirectPath}?order=${orderId}&token=${token}`);
    } catch (err) {
      console.error(err);
      alert('Error communicating with mock payment server.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
      <FadeIn className="max-w-md w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-6 text-center text-white">
          <h1 className="text-2xl font-bold tracking-tight">Two Hundred Burger</h1>
          <p className="text-blue-100 text-sm mt-1">Mock Payment Gateway</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm text-center">
            <strong>Demo Mode:</strong> No real money will be charged. Please simulate a response below.
          </div>
          
          <div className="mb-8 text-center">
            <p className="text-slate-500 text-sm mb-1">Order Number</p>
            <p className="font-mono text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block">
              {orderId}
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
              onClick={() => handleSimulate('success')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Simulate Successful Payment'}
            </Button>
            
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-sm"
              onClick={() => handleSimulate('failed')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Simulate Failed Payment'}
            </Button>

            <Button 
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => handleSimulate('cancelled')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Cancel Order'}
            </Button>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <MockPaymentContent />
    </Suspense>
  );
}
