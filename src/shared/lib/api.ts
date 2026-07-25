import { getClientToken } from "./cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function getAuthHeaders(): Record<string, string> {
  const token = getClientToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const get = {
  headers: () => ({ ...getAuthHeaders() }),
};

const mut = {
  headers: () => ({ "Content-Type": "application/json", ...getAuthHeaders() }),
};

export const api = {
  stores: {
    list: () => ({ url: `${BASE}/api/stores`, headers: get.headers() }),
    detail: (id: string) => ({ url: `${BASE}/api/stores/${id}`, headers: get.headers() }),
    bySlug: (slug: string) => ({ url: `${BASE}/api/stores/by-slug/${slug}`, headers: get.headers() }),
    create: () => ({ url: `${BASE}/api/stores`, headers: mut.headers() }),
    update: (id: string) => ({ url: `${BASE}/api/stores/${id}`, headers: mut.headers() }),
  },
  products: {
    byStore: (storeId: string) => ({ url: `${BASE}/api/products/store/${storeId}`, headers: get.headers() }),
    detail: (id: string) => ({ url: `${BASE}/api/products/${id}`, headers: get.headers() }),
    create: () => ({ url: `${BASE}/api/products`, headers: mut.headers() }),
    update: (id: string) => ({ url: `${BASE}/api/products/${id}`, headers: mut.headers() }),
  },
  orders: {
    byStore: (storeId: string) => ({ url: `${BASE}/api/orders/store/${storeId}`, headers: get.headers() }),
    detail: (id: string) => ({ url: `${BASE}/api/orders/${id}`, headers: get.headers() }),
    byPhone: (phone: string) => ({ url: `${BASE}/api/orders/phone/${phone}`, headers: get.headers() }),
    create: () => ({ url: `${BASE}/api/orders`, headers: mut.headers() }),
    update: (id: string) => ({ url: `${BASE}/api/orders/${id}`, headers: mut.headers() }),
  },
} as const;
