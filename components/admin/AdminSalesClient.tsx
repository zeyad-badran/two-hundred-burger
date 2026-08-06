'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminSalesClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const fetchSalesData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sales-summary');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch sales data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) return <div className="min-h-screen bg-char text-cream flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-char text-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="font-display text-3xl font-semibold">Sales Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Link href="/admin/menu">
              <Button variant="outline" className="text-cream border-cream hover:bg-cream hover:text-char">Menu Management</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {error && <p className="text-ember mb-4">{error}</p>}

        <p className="text-cream-muted text-sm mb-6 border border-char-soft p-3 rounded bg-char-soft">
          <strong>Note:</strong> Demo dashboard. Mock card payments and collected cash are counted as revenue.
        </p>

        {data && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-char-soft border border-char-line rounded-lg p-4">
                <div className="text-cream-muted text-sm mb-1">Today&apos;s Revenue</div>
                <div className="font-ticket text-2xl text-sear">{data.metrics.todayRevenue.toFixed(2)} JOD</div>
              </div>
              <div className="bg-char-soft border border-char-line rounded-lg p-4">
                <div className="text-cream-muted text-sm mb-1">Today&apos;s Orders</div>
                <div className="font-ticket text-2xl text-cream">{data.metrics.todayOrdersCount}</div>
              </div>
              <div className="bg-char-soft border border-char-line rounded-lg p-4">
                <div className="text-cream-muted text-sm mb-1">All-Time Revenue</div>
                <div className="font-ticket text-2xl text-emerald-400">{data.metrics.allTimeRevenue.toFixed(2)} JOD</div>
              </div>
              <div className="bg-char-soft border border-char-line rounded-lg p-4">
                <div className="text-cream-muted text-sm mb-1">All-Time Orders</div>
                <div className="font-ticket text-2xl text-cream">{data.metrics.allTimeOrdersCount}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-char-soft border border-char-line rounded-lg p-4 text-center">
                <div className="text-amber-400 font-bold text-xl">{data.metrics.pendingCashOrders}</div>
                <div className="text-cream-muted text-xs uppercase tracking-wider mt-1">Pending Cash</div>
              </div>
              <div className="bg-char-soft border border-char-line rounded-lg p-4 text-center">
                <div className="text-blue-400 font-bold text-xl">{data.metrics.completedOrders}</div>
                <div className="text-cream-muted text-xs uppercase tracking-wider mt-1">Completed</div>
              </div>
              <div className="bg-char-soft border border-char-line rounded-lg p-4 text-center">
                <div className="text-ember font-bold text-xl">{data.metrics.cancelledOrders}</div>
                <div className="text-cream-muted text-xs uppercase tracking-wider mt-1">Cancelled</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Branch Breakdown */}
              <div className="bg-char-soft border border-char-line rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 border-b border-char-line pb-2">Revenue by Branch</h2>
                <div className="space-y-3">
                  {data.branchBreakdown.length === 0 && <p className="text-cream-muted text-sm">No branch data available.</p>}
                  {data.branchBreakdown.map((b: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-cream">{b.branchName}</span>
                      <div className="text-right">
                        <span className="block font-ticket text-sear">{b.revenue.toFixed(2)} JOD</span>
                        <span className="block text-xs text-cream-muted">{b.orders} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Selling Items */}
              <div className="bg-char-soft border border-char-line rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 border-b border-char-line pb-2">Best-Selling Items</h2>
                <div className="space-y-3">
                  {data.bestSellingItems.length === 0 && <p className="text-cream-muted text-sm">No item data available.</p>}
                  {data.bestSellingItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-cream">{item.itemName}</span>
                      <div className="text-right">
                        <span className="block text-cream">{item.quantity} sold</span>
                        <span className="block text-xs text-emerald-400 font-ticket">{item.revenue.toFixed(2)} JOD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-char-soft border border-char-line rounded-lg p-6 overflow-x-auto">
              <h2 className="text-xl font-bold mb-4 border-b border-char-line pb-2">Recent Valid Orders</h2>
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-cream-muted text-sm uppercase tracking-wider border-b border-char-line">
                    <th className="py-3 pr-4">Order ID</th>
                    <th className="py-3 pr-4">Time</th>
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">Branch</th>
                    <th className="py-3 pr-4">Type</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.recentOrders.length === 0 && (
                    <tr><td colSpan={7} className="py-4 text-cream-muted text-center">No recent valid orders found.</td></tr>
                  )}
                  {data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-char-line/50 hover:bg-char transition-colors">
                      <td className="py-3 pr-4 font-ticket text-sear">#{order.short_id}</td>
                      <td className="py-3 pr-4 text-cream-muted">{new Date(order.created_at).toLocaleTimeString()}</td>
                      <td className="py-3 pr-4">{order.customer_name}</td>
                      <td className="py-3 pr-4 text-cream-muted">{order.branch_name}</td>
                      <td className="py-3 pr-4 capitalize">{order.fulfillment_type}</td>
                      <td className="py-3 pr-4">
                        <span className="block capitalize">{order.status}</span>
                        <span className="block text-xs text-cream-muted">{order.payment_status}</span>
                      </td>
                      <td className="py-3 text-right font-ticket">{order.total.toFixed(2)} JOD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
