import { redirect } from 'next/navigation';
import { verifyStaffSession } from '@/lib/staff-auth';
import KitchenDashboardClient from './KitchenDashboardClient';

export const dynamic = 'force-dynamic';

export default async function KitchenPage() {
  const isAuthorized = await verifyStaffSession();
  
  if (!isAuthorized) {
    redirect('/kitchen/login');
  }

  // Pass the poll interval from environment
  const pollInterval = parseInt(process.env.KITCHEN_POLL_INTERVAL_MS || '10000', 10);

  return <KitchenDashboardClient pollIntervalMs={pollInterval} />;
}
