import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createPaymentSession } from '@/lib/payments';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    // 1. Fetch the order details needed for the payment session
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, subtotal, customer_name, customer_phone, status')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'paid' || order.status === 'completed') {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    }

    // 2. Create a new payment session
    const { redirectUrl } = await createPaymentSession(
      order.id,
      order.subtotal,
      order.customer_name,
      order.customer_phone
    );

    // 3. Reset the order status to pending for the new attempt
    await supabaseAdmin
      .from('orders')
      .update({ status: 'pending', payment_status: 'pending' })
      .eq('id', orderId);

    return NextResponse.json({ success: true, redirectUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Retry Payment API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
