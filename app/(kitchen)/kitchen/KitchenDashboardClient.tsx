'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, LogOut, Phone, MapPin, MessageCircle, Clock, Volume2, VolumeX, Printer, Store } from 'lucide-react';

type OrderItem = {
  id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
};

type RestaurantNotification = {
  wa_link: string;
};

type Order = {
  id: string;
  status: string;
  payment_provider: string;
  payment_status: string;
  subtotal: number;
  delivery_fee?: number;
  delivery_distance_km?: number;
  customer_name: string;
  customer_phone: string;
  fulfillment_type: string;
  delivery_address: string | null;
  notes: string | null;
  items?: any; // Fallback for old orders
  created_at: string;
  order_items: OrderItem[];
  restaurant_notifications: RestaurantNotification[];
  branch_name?: string | null;
  branch_address?: string | null;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
  delivery_map_url?: string | null;
};

export default function KitchenDashboardClient({ pollIntervalMs }: { pollIntervalMs: number }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const prevNewCountRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('kitchen_muted');
    if (saved !== null) {
      setIsMuted(saved === 'true');
    } else {
      setIsMuted(false); // default on
    }
  }, []);

  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    localStorage.setItem('kitchen_muted', String(newVal));
    setHasInteracted(true);
  };

  const playBeep = useCallback(() => {
    try {
      const audio = new Audio('/sounds/new-order.wav');
      audio.play().catch((e) => {
        console.log('Audio playback failed, falling back to beep', e);
        // Fallback beep
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      });
    } catch (e) {
      console.log('Audio playback completely failed', e);
    }
  }, []);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/kitchen/orders');
      if (res.status === 401) {
        router.push('/kitchen/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch orders');
      
      const data = await res.json();
      const fetchedOrders = data.orders || [];
      setOrders(fetchedOrders);

      // Check for new orders to play sound
      const currentNewCount = fetchedOrders.filter((o: Order) => o.status === 'paid' || (o.status === 'pending' && o.payment_provider === 'cash')).length;
      
      if (silent && currentNewCount > prevNewCountRef.current && !isMuted) {
        playBeep();
      }
      prevNewCountRef.current = currentNewCount;

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router, isMuted, playBeep]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchOrders, pollIntervalMs]);

  const handleLogout = async () => {
    await fetch('/api/staff/logout', { method: 'POST' });
    router.push('/kitchen/login');
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/kitchen/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        await fetchOrders(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update order');
      }
    } catch (err) {
      alert('Network error occurred.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrint = (order: Order) => {
    window.open(`/kitchen/orders/${order.id}/receipt`, '_blank');
  };

  // Group orders by status
  const groupedOrders = {
    new: orders.filter(o => o.status === 'paid' || (o.status === 'pending' && o.payment_provider === 'cash')),
    preparing: orders.filter(o => o.status === 'preparing'),
    ready: orders.filter(o => o.status === 'ready'),
    completed: orders.filter(o => o.status === 'completed'),
    cancelled: orders.filter(o => o.status === 'cancelled'),
  };

  const renderOrderCard = (order: Order) => {
    const isCOD = order.payment_provider === 'cash';
    const waLink = order.restaurant_notifications?.[0]?.wa_link;

    return (
      <div key={order.id} className="bg-char-surface border border-char-soft rounded-xl p-5 mb-4 relative">
        <div className="flex justify-between items-start mb-4 border-b border-char-soft pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-sm text-sear bg-sear/10 px-2 py-0.5 rounded">
                #{order.id.slice(0, 8)}
              </span>
              
              {/* Dynamic Badges */}
              {order.status === 'completed' && isCOD && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Cash Collected
                </span>
              )}
              {order.status !== 'completed' && order.status !== 'cancelled' && isCOD && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  Cash on Delivery
                </span>
              )}
              {order.status !== 'cancelled' && !isCOD && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Mock Paid
                </span>
              )}
              {order.status === 'cancelled' && !isCOD && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-ember/20 text-ember">
                  Paid / Cancelled
                </span>
              )}
              {order.status === 'cancelled' && isCOD && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-ember/20 text-ember">
                  Cancelled
                </span>
              )}
            </div>
            <div className="flex items-center text-cream/60 text-sm gap-1">
              <Clock className="w-4 h-4" />
              {new Date(order.created_at).toLocaleTimeString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-cream">{(order.subtotal + (order.delivery_fee || 0)).toFixed(2)} JOD</div>
            <div className="text-sm font-medium text-cream capitalize">{order.fulfillment_type}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold text-cream text-lg">{order.customer_name}</div>
          <div className="flex items-center text-cream/60 text-sm gap-1 mt-1">
            <Phone className="w-4 h-4" /> {order.customer_phone}
          </div>
          {order.branch_name && (
            <div className="flex items-start text-cream/60 text-sm gap-1 mt-1">
              <Store className="w-4 h-4 mt-0.5 shrink-0 text-sear" /> 
              <span><span className="font-bold text-cream">Branch:</span> {order.branch_name} <br/> <span className="text-xs">{order.branch_address}</span></span>
            </div>
          )}
          {order.delivery_address && order.delivery_address !== 'Pickup' && (
            <div className="flex items-start text-cream/60 text-sm gap-1 mt-1">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 
              <span>
                {order.delivery_address}
                {order.delivery_distance_km !== undefined && order.delivery_distance_km !== null && (
                  <span className="block mt-0.5 text-sear text-xs font-bold">
                    Distance: {Number(order.delivery_distance_km).toFixed(1)} km
                  </span>
                )}
                {order.delivery_fee !== undefined && order.delivery_fee !== null && (
                  <span className="block text-cream-muted text-xs">
                    Delivery Fee: {Number(order.delivery_fee).toFixed(2)} JOD
                  </span>
                )}
              </span>
            </div>
          )}
          {order.delivery_address && order.delivery_address !== 'Pickup' && (
            <div className="flex items-start text-cream/60 text-sm gap-1 mt-1">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" /> 
              {order.delivery_map_url ? (
                <div className="flex flex-col">
                  <a href={order.delivery_map_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline">
                    Open Map
                  </a>
                  {order.delivery_lat && <span className="text-xs text-cream/40">{order.delivery_lat}, {order.delivery_lng}</span>}
                </div>
              ) : (
                <span className="text-cream/40 italic">No map pin provided</span>
              )}
            </div>
          )}
        </div>

        <div className="bg-char rounded-lg p-3 mb-4">
          <div className="text-xs font-bold text-cream/60 uppercase tracking-wider mb-2">Items</div>
          <ul className="space-y-1">
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map(item => (
                <li key={item.id} className="text-cream text-sm flex justify-between">
                  <span><span className="text-sear font-bold">{item.quantity}x</span> {item.item_name}</span>
                </li>
              ))
            ) : order.items && order.items.length > 0 ? (
              // Fallback for older JSON items structure if any
              order.items.map((item: any, idx: number) => (
                <li key={idx} className="text-cream text-sm flex justify-between">
                  <span><span className="text-sear font-bold">{item.quantity}x</span> {item.name || item.item_name}</span>
                </li>
              ))
            ) : (
              <li className="text-cream/50 text-sm italic py-2">
                No items found for this order.
              </li>
            )}
          </ul>
          {order.notes && (
            <div className="mt-3 text-sm text-amber-200 bg-amber-900/30 p-2 rounded border border-amber-900/50">
              <span className="font-bold">Notes:</span> {order.notes}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {/* Status Buttons */}
          {(order.status === 'paid' || order.status === 'pending') && (
            <button 
              onClick={() => updateStatus(order.id, 'preparing')}
              disabled={updatingId === order.id}
              className="bg-sear text-char font-bold py-2 px-4 rounded-lg flex-1 min-w-[120px] hover:bg-[#e05a30] transition-colors disabled:opacity-50"
            >
              Start Preparing
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button 
              onClick={() => updateStatus(order.id, 'ready')}
              disabled={updatingId === order.id}
              className="bg-emerald-500 text-char font-bold py-2 px-4 rounded-lg flex-1 min-w-[120px] hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              Mark Ready
            </button>
          )}
          
          {order.status === 'ready' && (
            <button 
              onClick={() => updateStatus(order.id, 'completed')}
              disabled={updatingId === order.id}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex-1 min-w-[120px] hover:bg-blue-400 transition-colors disabled:opacity-50"
            >
              {isCOD ? 'Complete & Collect Cash' : 'Mark Completed'}
            </button>
          )}

          {/* Cancel Button */}
          {['pending', 'paid', 'preparing', 'ready'].includes(order.status) && (
            <button 
              onClick={() => updateStatus(order.id, 'cancelled')}
              disabled={updatingId === order.id}
              className="bg-char border border-ember text-ember font-bold py-2 px-4 rounded-lg flex-1 min-w-[120px] hover:bg-ember/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          {order.status === 'cancelled' && (
            <button 
              onClick={() => updateStatus(order.id, isCOD ? 'pending' : 'paid')}
              disabled={updatingId === order.id}
              className="bg-char border border-char-soft text-cream/60 font-bold py-2 px-4 rounded-lg flex-1 min-w-[120px] hover:text-cream hover:border-cream transition-colors disabled:opacity-50"
            >
              Restore Order
            </button>
          )}

          {/* WhatsApp Button if available */}
          {waLink && !['completed', 'cancelled'].includes(order.status) && (
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors w-full mt-2"
            >
              <MessageCircle className="w-5 h-5" /> Send WhatsApp
            </a>
          )}

          {/* Print Button */}
          <button 
            onClick={() => handlePrint(order)}
            className="bg-char-surface border border-char-line text-cream-muted hover:text-cream py-2 px-4 rounded-lg flex-1 min-w-[120px] flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, ordersList: Order[], emptyMsg: string) => (
    <div className="flex-1 min-w-[300px]">
      <div className="sticky top-0 bg-char py-4 z-10 border-b border-char-soft mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-cream tracking-tight">{title}</h2>
        <span className="bg-char-surface text-cream text-xs font-bold px-2 py-1 rounded-full">
          {ordersList.length}
        </span>
      </div>
      <div className="space-y-4">
        {ordersList.length === 0 ? (
          <div className="text-cream/60 text-sm italic p-4 text-center border border-dashed border-char-soft rounded-xl">{emptyMsg}</div>
        ) : (
          ordersList.map(renderOrderCard)
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-char pb-20">
      <header className="bg-char-surface border-b border-char-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-cream tracking-tight">Kitchen<span className="text-sear">Dashboard</span></h1>
            {isLoading && <span className="text-cream/60 text-xs animate-pulse">Syncing...</span>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-cream/60 hidden md:inline">
                {isMuted ? "Sound alerts off" : "Sound alerts enabled"}
              </span>
              <button 
                onClick={toggleMute}
                className={`p-2 rounded-lg transition-colors border ${isMuted ? 'border-char-soft text-cream/60 hover:bg-char-soft' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'}`}
                title={isMuted ? "Click to enable sound" : "Mute Alerts"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            <button 
              onClick={() => fetchOrders()}
              className="p-2 text-cream/60 hover:text-cream hover:bg-char rounded-lg transition-colors border border-char-soft"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-cream/60 hover:text-ember hover:bg-char rounded-lg transition-colors flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-ember/10 border-b border-ember/20 text-ember p-4 text-center text-sm font-bold">
          {error}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-8 items-start">
          {renderSection('New Orders', groupedOrders.new, 'No new orders.')}
          {renderSection('Preparing', groupedOrders.preparing, 'No orders being prepared.')}
          {renderSection('Ready', groupedOrders.ready, 'No orders waiting.')}
        </div>

        <div className="mt-16 pt-8 border-t border-char-soft opacity-75 hover:opacity-100 transition-opacity">
          <h2 className="text-xl font-black text-cream/60 mb-6">Recent History</h2>
          <div className="flex flex-wrap gap-8 items-start">
            {renderSection('Completed', groupedOrders.completed.slice(0, 10), 'No completed orders yet.')}
            {renderSection('Cancelled', groupedOrders.cancelled.slice(0, 10), 'No cancelled orders.')}
          </div>
        </div>
      </main>
    </div>
  );
}
