import type { Product } from "./types";
import { api } from "@/shared/lib/api";

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  const { url, headers } = api.products.byStore(storeId);
  const res = await fetch(url, { headers });
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
  const { url, headers } = api.products.create();
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const { url, headers } = api.products.update(id);
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}
