import type { Store } from "./types";
import { api } from "@/shared/lib/api";

export async function getStores(): Promise<Store[]> {
  const { url, headers } = api.stores.list();
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
}

export async function getStoreById(id: string): Promise<Store> {
  const { url, headers } = api.stores.detail(id);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
}

export async function getStoreBySlug(slug: string): Promise<Store> {
  const { url, headers } = api.stores.bySlug(slug);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
}

export async function updateStore(id: string, data: Partial<Store>): Promise<Store> {
  const { url, headers } = api.stores.update(id);
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? "Failed to update store");
  }
  return res.json();
}
