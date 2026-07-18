"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "../types";
import { getOrdersByStore } from "../api";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderList({ storeId, slug }: { storeId: string; slug: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersByStore(storeId)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [storeId]);

  if (loading) return <div className="p-8 text-center text-yellow-700/60">Cargando pedidos...</div>;

  if (orders.length === 0)
    return <div className="p-8 text-center text-yellow-700/60">No hay pedidos</div>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b border-yellow-100 bg-yellow-50/50">
          <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Cliente</th>
          <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Teléfono</th>
          <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Estado</th>
          <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap text-right">Total</th>
          <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Fecha</th>
          <th className="px-5 py-3"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-yellow-50 last:border-0 hover:bg-yellow-50/50 transition-colors">
            <td className="px-5 py-3 whitespace-nowrap font-medium text-yellow-950">
              {order.customer_name ?? "—"}
            </td>
            <td className="px-5 py-3 whitespace-nowrap text-yellow-700/60">
              {order.customer_phone}
            </td>
            <td className="px-5 py-3 whitespace-nowrap">
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="px-5 py-3 whitespace-nowrap text-right tabular-nums text-yellow-950">
              {order.total_amount ? `$${order.total_amount}` : "—"}
            </td>
            <td className="px-5 py-3 whitespace-nowrap text-yellow-700/60">
              {new Date(order.created_at).toLocaleDateString("es")}
            </td>
            <td className="px-5 py-3 whitespace-nowrap text-right">
              <Link
                href={`/stores/${slug}/orders/${order.id}`}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                Ver →
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
