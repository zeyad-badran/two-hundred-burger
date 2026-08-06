import { verifyStaffSession } from '@/lib/staff-auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import ReceiptClient from './ReceiptClient';

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const isAuthorized = await verifyStaffSession();
  
  if (!isAuthorized) {
    redirect('/kitchen/login');
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', params.id)
    .single();

  if (error || !order) {
    return (
      <div className="p-8 text-center bg-char text-cream min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-ember mb-4">Order not found</h1>
        <a href="/kitchen" className="text-blue-400 hover:underline">Back to Kitchen</a>
      </div>
    );
  }

  // Remove secrets if any (although Server Component can pass directly to Client safely if careful, we sanitize)
  const { payment_payload, ...safeOrder } = order;

  return <ReceiptClient order={safeOrder} />;
}
