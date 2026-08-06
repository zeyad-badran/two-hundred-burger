import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    // 1. Check if order exists
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status, payment_status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Fetch existing notification
    const { data: notification } = await supabaseAdmin
      .from('restaurant_notifications')
      .select('id, order_id, status, restaurant_phone, wa_link, message, created_at')
      .eq('order_id', orderId)
      .eq('notification_type', 'new_order')
      .maybeSingle();

    return NextResponse.json({ notification: notification || null }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch restaurant notification API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
