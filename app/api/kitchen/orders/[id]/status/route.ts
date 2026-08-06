import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/staff-auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthorized = await verifyStaffSession();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.id;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 1. Fetch current order state
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('status, payment_provider')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const currentStatus = order.status;

    // 2. Validate Transitions
    const allowedTransitions: Record<string, string[]> = {
      pending: ['preparing', 'cancelled'], // COD starts as pending
      paid: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed', 'cancelled'],
      completed: [],
      cancelled: ['pending', 'paid'],
    };

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    // 3. Prepare update payload
    const updatePayload: any = {
      status,
    };

    // If completing a cash order, mark as paid
    if (status === 'completed' && order.payment_provider === 'cash') {
      updatePayload.payment_status = 'cash_collected';
      updatePayload.paid_at = new Date().toISOString();
    }

    // 4. Perform update
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    console.error('Update order status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
