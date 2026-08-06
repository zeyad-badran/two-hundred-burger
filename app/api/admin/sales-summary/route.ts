import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const isAuthorized = await verifyAdminSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const now = new Date();
    // Use local timezone offset to calculate today correctly
    const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    let todayRevenue = 0;
    let todayOrdersCount = 0;
    let allTimeRevenue = 0;
    let allTimeOrdersCount = 0;
    
    let pendingCashOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    const branchStats: Record<string, { branchName: string; revenue: number; orders: number }> = {};
    const itemStats: Record<string, { itemName: string; quantity: number; revenue: number }> = {};
    const recentOrders = [];

    for (const order of orders || []) {
      // created_at is UTC in Postgres, so we compare substring for simplicity
      // A more robust approach converts to local timezone, but this suffices for the demo.
      const isToday = order.created_at.startsWith(todayStr);
      
      const isMockPaid = order.payment_status === 'mock_paid' && order.status !== 'cancelled' && order.status !== 'payment_failed';
      const isCash = (order.payment_status === 'cash_on_delivery' || order.payment_status === 'cash_collected' || order.payment_provider === 'cash') && order.status !== 'cancelled' && order.status !== 'payment_failed';
      
      const isRevenue = isMockPaid || isCash;
      const orderTotal = Number(order.subtotal || 0) + Number(order.delivery_fee || 0);

      // Status counters
      if (order.status === 'cancelled') cancelledOrders++;
      if (order.status === 'completed') completedOrders++;
      if (order.status !== 'completed' && order.status !== 'cancelled' && (order.payment_provider === 'cash' || order.payment_status === 'cash_on_delivery')) {
        pendingCashOrders++;
      }

      if (isRevenue) {
        allTimeRevenue += orderTotal;
        allTimeOrdersCount++;
        
        if (isToday) {
          todayRevenue += orderTotal;
          todayOrdersCount++;
        }

        // Branch Breakdown
        const bId = order.branch_id || 'unknown';
        const bName = order.branch_name || 'Unknown Branch';
        if (!branchStats[bId]) branchStats[bId] = { branchName: bName, revenue: 0, orders: 0 };
        branchStats[bId].revenue += orderTotal;
        branchStats[bId].orders++;

        // Best Selling Items
        if (order.order_items && Array.isArray(order.order_items)) {
          for (const item of order.order_items) {
            const iId = item.item_id || item.item_name;
            if (!itemStats[iId]) itemStats[iId] = { itemName: item.item_name, quantity: 0, revenue: 0 };
            itemStats[iId].quantity += item.quantity;
            itemStats[iId].revenue += Number(item.price) * item.quantity;
          }
        }
      }

      // Recent valid orders (first 10)
      if (recentOrders.length < 10) {
        // Only include if it's not abandoned pending non-cash
        const isAbandoned = order.status === 'pending' && order.payment_provider !== 'cash';
        if (!isAbandoned) {
          recentOrders.push({
            id: order.id,
            short_id: order.id.slice(0, 8),
            created_at: order.created_at,
            customer_name: order.customer_name,
            branch_name: order.branch_name || 'Unknown',
            fulfillment_type: order.fulfillment_type || (order.delivery_address === 'Pickup' ? 'pickup' : 'delivery'),
            payment_status: order.payment_status,
            status: order.status,
            total: orderTotal,
          });
        }
      }
    }

    const branchArray = Object.values(branchStats).sort((a, b) => b.revenue - a.revenue);
    const topItems = Object.values(itemStats).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

    return NextResponse.json({
      metrics: {
        todayRevenue,
        todayOrdersCount,
        allTimeRevenue,
        allTimeOrdersCount,
        pendingCashOrders,
        completedOrders,
        cancelledOrders
      },
      branchBreakdown: branchArray,
      bestSellingItems: topItems,
      recentOrders
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error: any) {
    console.error('Admin sales API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
