'use client';

import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptClient({ order }: { order: any }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 text-black font-mono">
      {/* Non-printable controls */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center print:hidden">
        <Link href="/kitchen" className="flex items-center gap-2 text-gray-600 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      {/* Printable Receipt Area */}
      <div className="bg-white w-full max-w-sm p-6 shadow-sm border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase mb-1">Two Hundred Burger</h1>
          <p className="text-sm">Order #{order.id.slice(0, 8)}</p>
          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div className="border-t border-dashed border-gray-400 my-4"></div>

        <div className="space-y-1 mb-4">
          <p><span className="font-bold">Customer:</span> {order.customer_name}</p>
          <p><span className="font-bold">Phone:</span> {order.customer_phone}</p>
          <p><span className="font-bold">Fulfillment:</span> <span className="capitalize">{order.fulfillment_type}</span></p>
          
          {order.branch_name && (
            <div className="mt-2">
              <p><span className="font-bold">Branch:</span> {order.branch_name}</p>
              <p className="text-sm pl-2">{order.branch_address}</p>
            </div>
          )}

          {order.delivery_address && order.delivery_address !== 'Pickup' && (
            <div className="mt-2">
              <p><span className="font-bold">Delivery Address:</span></p>
              <p className="text-sm pl-2">{order.delivery_address}</p>
              {order.delivery_map_url && (
                <p className="text-sm pl-2 text-blue-600 underline break-all mt-1">{order.delivery_map_url}</p>
              )}
              {order.delivery_distance_km !== undefined && order.delivery_distance_km !== null && (
                <p className="text-sm pl-2 mt-1 font-bold">Distance: {Number(order.delivery_distance_km).toFixed(1)} km</p>
              )}
              {order.delivery_lat && (
                <p className="text-xs text-gray-500 pl-2 mt-1">Coords: {order.delivery_lat}, {order.delivery_lng}</p>
              )}
            </div>
          )}
          {order.notes && (
            <div className="mt-2 p-2 bg-gray-50 border border-gray-200">
              <span className="font-bold">Notes:</span> {order.notes}
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-gray-400 my-4"></div>

        <div className="mb-4">
          <p className="font-bold mb-2">Items:</p>
          <ul className="space-y-2">
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item: any) => (
                <li key={item.id} className="flex justify-between items-start">
                  <span className="flex-1 pr-4">{item.quantity}x {item.item_name}</span>
                  <span>{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))
            ) : (
              <li className="italic text-gray-500">No items found</li>
            )}
          </ul>
        </div>

        <div className="border-t border-dashed border-gray-400 my-4"></div>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>{Number(order.subtotal).toFixed(2)} JOD</span>
          </div>
          {order.fulfillment_type === 'delivery' && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee:</span>
              <span>{Number(order.delivery_fee || 0).toFixed(2)} JOD</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span>{(Number(order.subtotal) + Number(order.delivery_fee || 0)).toFixed(2)} JOD</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-4"></div>

        <div className="space-y-1 text-sm text-gray-600 text-center">
          <p className="capitalize">Status: <span className="font-bold text-black">{order.status}</span></p>
          <p className="capitalize">Payment: <span className="font-bold text-black">{order.payment_status?.replace(/_/g, ' ')}</span></p>
          <p className="capitalize">Method: <span className="font-bold text-black">{order.payment_provider}</span></p>
        </div>

        <div className="mt-8 text-center text-sm font-bold">
          Thank you!
        </div>
      </div>
    </div>
  );
}
