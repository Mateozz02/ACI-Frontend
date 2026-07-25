import type { Order } from "./types";
import { api } from "@/shared/lib/api";

export async function getOrdersByStore(storeId: string): Promise<Order[]> {
  const { url, headers } = api.orders.byStore(storeId);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrderById(orderId: string): Promise<Order> {
  const { url, headers } = api.orders.detail(orderId);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}
