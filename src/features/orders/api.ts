import type { Order } from "./types";
import { api } from "@/shared/lib/api";

export async function getOrdersByStore(storeId: string): Promise<Order[]> {
  const res = await fetch(api.orders.byStore(storeId));
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrderById(orderId: string): Promise<Order> {
  const res = await fetch(api.orders.detail(orderId));
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}
