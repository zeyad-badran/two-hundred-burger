import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/staff-auth';

// Ensure this route is never cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const isAuthorized = await verifyStaffSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate midnight today in Jordan time (UTC+3)
    const now = new Date();
    const jordanDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Amman',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
    
    const [month, day, year] = jordanDateStr.split('/');
    const startOfToday = new Date(`${year}-${month}-${day}T00:00:00+03:00`).toISOString();

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*),
        restaurant_notifications (*)
      `)
      .gte('created_at', startOfToday)
      .in('status', ['paid', 'pending', 'preparing', 'ready', 'completed', 'cancelled'])
      .order('created_at', { ascending: false })
      .limit(200); // Reasonable limit for a live dashboard

    if (error) {
      throw error;
    }

    // Filter out abandoned card orders (status pending, but not cash)
    const validOrders = orders?.filter((order) => {
      if (order.status === 'pending' && order.payment_provider !== 'cash') {
        return false;
      }
      return true;
    }) || [];

    // Clean up sensitive fields before sending to the frontend
    const sanitizedOrders = validOrders.map(order => {
      const { payment_payload, ...safeOrder } = order;
      return safeOrder;
    });

    return NextResponse.json({ orders: sanitizedOrders }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch kitchen orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
