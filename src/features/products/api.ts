import type { Product } from "./types";
import { api } from "@/shared/lib/api";

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  const res = await fetch(api.products.byStore(storeId));
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(product: {
  store_id: string;
  name: string;
  unit: string;
  price: number;
  description?: string | null;
  category?: string | null;
  is_available?: boolean;
}): Promise<Product> {
  const res = await fetch(api.products.create(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(store_id: string, data: Partial<Product>): Promise<Product> {
  const res = await fetch(api.products.update(store_id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}