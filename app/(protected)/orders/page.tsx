"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/authContext";
import { demoOrders, demoProductsAll } from "@/lib/demoData";

type CartLine = { id: string; productId: string; qty: number; projectId?: string; area?: string };
type Order = { id: string; items: CartLine[]; total: number; status: string; ts: number };

const ORDERS_KEY = "dc:orders";

export default function OrdersPage() {
  const { isDemo, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      // Demo mode - use demo orders
      const existing = localStorage.getItem(ORDERS_KEY);
      let loadedOrders: Order[] = [];
      
      if (!existing || existing === "[]") {
        // preload demo orders if none exist
        localStorage.setItem(ORDERS_KEY, JSON.stringify(demoOrders));
        loadedOrders = demoOrders;
      } else {
        loadedOrders = JSON.parse(existing);
      }
      
      setOrders(loadedOrders);
    } else {
      // Real user mode - start with empty orders
      // In a real app, you would fetch user-specific orders from a database
      const userOrdersKey = `dc:orders:${user?.id || 'user'}`;
      const existing = localStorage.getItem(userOrdersKey);
      const loadedOrders = existing ? JSON.parse(existing) : [];
      setOrders(loadedOrders);
    }
    
    setLoading(false);
  }, [isDemo, user]);

  function updateStatus(id: string, status: string) {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    
    const storageKey = isDemo ? ORDERS_KEY : `dc:orders:${user?.id || 'user'}`;
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  if (loading) {
    return (
      <main className="p-10 text-zinc-500">Loading Orders...</main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-1.5 rounded-full bg-[#d96857]" />
          <h1 className="text-2xl font-semibold text-[#2e2e2e]">Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f2f0ed] text-[#2e2e2e]">
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Items</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Placed</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-[#f9f9f8] transition">
                    <td className="p-3 font-medium text-[#2e2e2e]">{o.id}</td>
                    <td className="p-3">
                      {o.items.length} item{o.items.length === 1 ? "" : "s"}
                    </td>
                    <td className="p-3 font-semibold text-[#2e2e2e]">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-2xl text-xs font-medium ${
                          o.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : o.status === "Placed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-zinc-600">
                      {new Date(o.ts).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <a href={`/orders/${o.id}`} className="px-3 py-1 text-xs rounded-2xl border border-zinc-300 text-[#2e2e2e] hover:bg-black/5">Details</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
