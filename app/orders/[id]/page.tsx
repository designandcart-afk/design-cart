
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { demoOrders, demoProductsAll } from "@/lib/demoData";

type CartLine = { id: string; productId: string; qty: number; projectId?: string; area?: string };
type Order = { id: string; items: CartLine[]; total: number; status: string; ts: number };

const ORDERS_KEY = "dc:orders";

export default function OrderDetailPage(){
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = localStorage.getItem(ORDERS_KEY);
    let allOrders: Order[] = [];
    
    if (!existing || existing === "[]") {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(demoOrders));
      allOrders = demoOrders;
    } else {
      allOrders = JSON.parse(existing);
    }
    
    const foundOrder = allOrders.find(o => o.id === id);
    setOrder(foundOrder || allOrders[0] || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-zinc-500">Loading order...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-zinc-300 hover:bg-zinc-50 transition-colors text-sm text-zinc-600 hover:text-zinc-800"
            >
              ← Back
            </button>
          </div>
          <div className="rounded-2xl border border-zinc-300 p-10 text-center text-zinc-500">
            Order not found
          </div>
        </div>
      </main>
    );
  }

  const items = order.items.map(line => {
    const p = demoProductsAll.find(pp=>pp.id===line.productId);
    return { ...line, product: p };
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={()=>router.back()} 
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-zinc-300 hover:bg-zinc-50 transition-colors text-sm text-zinc-600 hover:text-zinc-800"
          >
            ← Back
          </button>
          <div className="h-6 w-px bg-zinc-300" />
          <h1 className="text-xl font-semibold text-[#2e2e2e]">Order Details</h1>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-5 bg-[#f2f0ed]">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-zinc-500">Order ID:</span> <span className="font-medium text-[#2e2e2e]">{order.id}</span></div>
            <div><span className="text-zinc-500">Invoice #:</span> <span className="font-medium text-[#2e2e2e]">INV-{order.id.slice(-6).toUpperCase()}</span></div>
            <div><span className="text-zinc-500">Status:</span> <span className="font-medium text-[#2e2e2e]">{order.status}</span></div>
            <div><span className="text-zinc-500">Placed:</span> <span className="font-medium text-[#2e2e2e]">{new Date(order.ts).toLocaleString()}</span></div>
          </div>

          <div className="mt-5 rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="p-3">Item</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((line)=> (
                  <tr key={line.id} className="border-t">
                    <td className="p-3">{line.product?.title || line.productId}</td>
                    <td className="p-3">{line.qty}</td>
                    <td className="p-3">₹{(line.product?.price||0).toLocaleString("en-IN")}</td>
                    <td className="p-3">₹{(((line.product?.price||0)*line.qty)).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-zinc-600">Download your invoice</span>
            <button className="px-4 py-2 rounded-2xl bg-[#d96857] text-white">Download Bill</button>
          </div>
        </div>
      </div>
    </main>
  );
}
