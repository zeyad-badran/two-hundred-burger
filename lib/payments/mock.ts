import crypto from 'crypto';

export async function createMockPaymentSession(
  orderId: string,
  subtotal: number,
  customerName: string,
  customerPhone: string
) {
  // Generate a random confirmation token that will be passed back in the URL
  const confirmationToken = crypto.randomBytes(16).toString('hex');
  
  // Return the redirect URL to the fake payment gateway
  return {
    redirectUrl: `/mock-payment?order=${orderId}&token=${confirmationToken}`
  };
}
