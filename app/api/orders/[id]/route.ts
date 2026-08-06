import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 60, 60000)) { // 60 requests per minute
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, created_at, customer_name, subtotal, status, payment_status, branch_name, delivery_address, delivery_map_url, delivery_distance_km, delivery_fee')
      .eq('id', params.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Fetch order API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
