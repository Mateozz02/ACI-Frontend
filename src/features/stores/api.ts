import type { Store } from "./types";
import { api } from "@/shared/lib/api";

export async function getStores(): Promise<Store[]> {
  const res = await fetch(api.stores.list());
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
}

export async function getStoreById(id: string): Promise<Store> {
  const res = await fetch(api.stores.detail(id));
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
}

export async function getStoreBySlug(slug: string): Promise<Store> {
  const res = await fetch(api.stores.bySlug(slug));
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
}

export async function updateStore(id:string,data:Partial<Store>): Promise<Store> {
  const res = await fetch(api.stores.update(id),{
    method : "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), 
  });
  
  if (!res.ok) throw new Error("Failed to update store");
  return res.json();

}