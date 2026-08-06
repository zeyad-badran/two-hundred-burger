import { verifyAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import AdminMenuClient from './AdminMenuClient';

export default async function AdminMenuPage() {
  const session = await verifyAdminSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return <AdminMenuClient />;
}
