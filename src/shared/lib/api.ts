const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = {
  stores: {
    list: () => `${BASE}/api/stores`,
    detail: (id: string) => `${BASE}/api/stores/${id}`,
    bySlug: (slug: string) => `${BASE}/api/stores/by-slug/${slug}`,
    create: () => `${BASE}/api/stores`,
    update: (id: string) => `${BASE}/api/stores/${id}`,
  },
  products: {
    byStore: (storeId: string) => `${BASE}/api/products/store/${storeId}`,
    detail: (id: string) => `${BASE}/api/products/${id}`,
    create: () => `${BASE}/api/products`,
    update: (id: string) => `${BASE}/api/products/${id}`,
  },
  orders: {
    byStore: (storeId: string) => `${BASE}/api/orders/store/${storeId}`,
    detail: (id: string) => `${BASE}/api/orders/${id}`,
    byPhone: (phone: string) => `${BASE}/api/orders/phone/${phone}`,
    create: () => `${BASE}/api/orders`,
    update: (id: string) => `${BASE}/api/orders/${id}`,
  },
} as const;
