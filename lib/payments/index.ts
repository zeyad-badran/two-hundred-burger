import { createMockPaymentSession } from './mock';

export type PaymentSessionResult = {
  redirectUrl: string;
};

export async function createPaymentSession(
  orderId: string,
  subtotal: number,
  customerName: string,
  customerPhone: string
): Promise<PaymentSessionResult> {
  const mode = process.env.PAYMENT_MODE || 'mock';

  if (mode === 'mock') {
    return createMockPaymentSession(orderId, subtotal, customerName, customerPhone);
  }

  if (mode === 'paytabs') {
    // Future Phase 3B: replace mock provider with real PayTabs once merchant account, trade license, profile ID, and server key are available.
    throw new Error('PayTabs integration is not yet implemented. Please switch to mock mode.');
  }

  throw new Error(`Unsupported payment mode: ${mode}`);
}
