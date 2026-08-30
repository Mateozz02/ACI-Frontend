"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Order } from "../types";
import { getOrderById } from "../api";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderDetail() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrderById(params.orderId).then(setOrder);
  }, [params.orderId]);

  if (!order) return <div className="p-8 text-center text-paper-700/60">Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-paper-950">
            {order.customer_name ?? order.customer_phone}
          </h2>
          <p className="text-sm text-paper-700/60 mt-0.5">{order.customer_phone}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-paper-100">
        <div>
          <dt className="text-xs text-paper-700/60 uppercase tracking-wide">Total</dt>
          <dd className="text-lg font-semibold mt-1 tabular-nums text-paper-950">
            {order.total_amount ? `$${order.total_amount}` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-paper-700/60 uppercase tracking-wide">Fecha</dt>
          <dd className="text-sm mt-1 text-paper-800">
            {new Date(order.created_at).toLocaleString("es")}
          </dd>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-paper-800/70 mb-3">Items</h3>
        <div className="border border-paper-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-50/50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-paper-800/70">Producto</th>
                <th className="text-left px-4 py-2.5 font-medium text-paper-800/70">Cantidad</th>
                <th className="text-right px-4 py-2.5 font-medium text-paper-800/70">Precio</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-paper-50">
                  <td className="px-4 py-2.5 font-medium text-paper-950">{item.product_name}</td>
                  <td className="px-4 py-2.5 text-paper-700/60">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-paper-950">${item.unit_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
