import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createRestaurantNotificationForOrder } from '@/lib/notifications/restaurant-whatsapp';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 20, 60000)) { // 20 requests per minute
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const mode = process.env.PAYMENT_MODE || 'mock';
    if (mode !== 'mock') {
      return NextResponse.json({ error: 'Mock payment disabled' }, { status: 403 });
    }

    const { orderId, token, result } = await request.json();

    if (!orderId || !token || !result) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real scenario, we'd verify the token matches a pending session.
    // For mock mode, we just update the order directly via admin client.
    
    let status = 'pending';
    let payment_status = 'mock_pending';
    const now = new Date().toISOString();
    let payload = { mock_token: token, result };
    let updates: any = { payment_provider: 'mock', payment_payload: payload };

    if (result === 'success') {
      status = 'paid';
      payment_status = 'mock_paid';
      updates.paid_at = now;
    } else if (result === 'failed') {
      status = 'payment_failed';
      payment_status = 'mock_failed';
    } else if (result === 'cancelled') {
      status = 'cancelled';
      payment_status = 'mock_cancelled';
      updates.cancelled_at = now;
    } else {
      return NextResponse.json({ error: 'Invalid result type' }, { status: 400 });
    }

    updates.status = status;
    updates.payment_status = payment_status;

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update mock order status:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Trigger restaurant notification for mock payment success
    if (result === 'success') {
      try {
        await createRestaurantNotificationForOrder(orderId);
      } catch (notifErr) {
        console.error('Failed to generate restaurant notification for mock payment:', notifErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Mock Payment API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
