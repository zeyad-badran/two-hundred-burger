import { verifyAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import AdminSalesClient from '@/components/admin/AdminSalesClient';

export default async function AdminSalesDashboardPage() {
  const session = await verifyAdminSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return <AdminSalesClient />;
}
