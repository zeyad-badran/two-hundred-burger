import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createPaymentSession } from '@/lib/payments';
import { createRestaurantNotificationForOrder } from '@/lib/notifications/restaurant-whatsapp';
import { branches } from '@/lib/branches';
import { calculateDistanceKm, isWithinDeliveryRadius } from '@/lib/delivery/distance';
import { calculateDeliveryFee } from '@/lib/delivery/fees';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(`checkout-${ip}`, 10, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const { 
      customerName, customerPhone, deliveryAddress, notes, items, subtotal, paymentMethod,
      fulfillment, branchId, branchName, branchAddress, deliveryLat, deliveryLng, deliveryMapUrl 
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0 || !branchId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Server-side branch validation
    const branchConfig = branches.find((b) => b.id === branchId);
    if (!branchConfig || !branchConfig.is_active) {
      return NextResponse.json({ error: 'Selected branch is invalid or inactive' }, { status: 400 });
    }

    let secureDeliveryFee = 0;
    let secureDistance: number | null = null;
    let secureRadius: number | null = null;
    let isDeliveryInRange: boolean | null = null;
    
    if (fulfillment === 'delivery') {
      if (!deliveryAddress) {
        return NextResponse.json({ error: 'Missing delivery address' }, { status: 400 });
      }
      if (deliveryLat === undefined || deliveryLat === null || deliveryLat < -90 || deliveryLat > 90) {
        return NextResponse.json({ error: 'Invalid delivery latitude' }, { status: 400 });
      }
      if (deliveryLng === undefined || deliveryLng === null || deliveryLng < -180 || deliveryLng > 180) {
        return NextResponse.json({ error: 'Invalid delivery longitude' }, { status: 400 });
      }

      // Calculate distance securely on the server
      secureDistance = calculateDistanceKm(
        branchConfig.latitude,
        branchConfig.longitude,
        deliveryLat,
        deliveryLng
      );
      secureRadius = branchConfig.delivery_radius_km;
      isDeliveryInRange = isWithinDeliveryRadius(secureDistance, secureRadius);

      if (!isDeliveryInRange) {
        return NextResponse.json({ error: 'DELIVERY_OUT_OF_RANGE' }, { status: 400 });
      }
    }

    // 1. Insert into orders table
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: fulfillment === 'delivery' ? deliveryAddress : 'Pickup',
        notes: notes || null,
        subtotal: subtotal,
        status: 'pending',
        payment_status: paymentMethod === 'cash' ? 'cash_on_delivery' : 'pending',
        payment_provider: paymentMethod === 'cash' ? 'cash' : 'mock',
        branch_id: branchId,
        branch_name: branchName,
        branch_address: branchAddress,
        delivery_lat: fulfillment === 'delivery' ? deliveryLat : null,
        delivery_lng: fulfillment === 'delivery' ? deliveryLng : null,
        delivery_map_url: fulfillment === 'delivery' ? deliveryMapUrl : null,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // 2. Fetch secure prices from database
    const itemSlugs = items.map((i: any) => i.id);
    const { data: menuItems, error: menuError } = await supabaseAdmin
      .from('menu_items')
      .select('slug, name_en, price, is_active, is_available')
      .in('slug', itemSlugs);

    if (menuError || !menuItems) {
      console.error('Menu items fetch error:', menuError);
      return NextResponse.json({ error: 'Failed to verify menu items' }, { status: 500 });
    }

    // 3. Validate items and recalculate total securely
    let secureSubtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dbItem = menuItems.find((m) => m.slug === item.id);
      
      if (!dbItem) {
        return NextResponse.json({ error: `Item not found: ${item.name}` }, { status: 400 });
      }
      if (!dbItem.is_active || !dbItem.is_available) {
        return NextResponse.json({ error: `Item is currently unavailable: ${dbItem.name_en}` }, { status: 400 });
      }

      const itemTotal = Number(dbItem.price) * item.quantity;
      secureSubtotal += itemTotal;

      orderItems.push({
        order_id: order.id,
        item_id: dbItem.slug,
        item_name: item.option ? `${dbItem.name_en} (${item.option})` : dbItem.name_en, // Use DB name + option
        price: Number(dbItem.price),
        quantity: item.quantity,
      });
    }

    // 4. Calculate delivery fee securely now that we have the secure subtotal
    if (fulfillment === 'delivery' && secureDistance !== null) {
      secureDeliveryFee = calculateDeliveryFee(secureDistance, secureSubtotal, branchConfig);
    }
    const finalTotal = secureSubtotal + secureDeliveryFee;

    // 5. Update the order with the secure calculations
    const { error: orderUpdateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        subtotal: secureSubtotal,
        delivery_distance_km: secureDistance,
        delivery_radius_km: secureRadius,
        is_delivery_in_range: isDeliveryInRange,
        delivery_fee: secureDeliveryFee,
        branch_lat: branchConfig.latitude,
        branch_lng: branchConfig.longitude
      })
      .eq('id', order.id);

    if (orderUpdateError) {
      console.error('Failed to update secure order total:', orderUpdateError);
      return NextResponse.json({ error: 'Failed to finalize secure order' }, { status: 500 });
    }

    // 6. Insert into order_items table
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      return NextResponse.json({ error: 'Failed to add items to order' }, { status: 500 });
    }

    if (paymentMethod === 'cash') {
      try {
        await createRestaurantNotificationForOrder(order.id);
      } catch (notifErr) {
        console.error('Failed to generate restaurant notification for COD:', notifErr);
      }

      return NextResponse.json({ 
        success: true, 
        orderId: order.id, 
        redirectUrl: `/payment-result?order=${order.id}` 
      }, { status: 200 });
    }

    // 7. Create payment session for card
    const { redirectUrl } = await createPaymentSession(
      order.id,
      finalTotal, // Final total including delivery fee used here!
      customerName,
      customerPhone
    );

    return NextResponse.json({ success: true, orderId: order.id, redirectUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
