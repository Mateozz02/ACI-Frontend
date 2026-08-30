"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStoreBySlug } from "@/features/stores/api";
import { OrderList } from "@/features/orders/components/OrderList";

export default function OrdersPage() {
  const params = useParams<{ slug: string }>();
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    getStoreBySlug(params.slug).then((s) => setStoreId(s.id));
  }, [params.slug]);

  if (!storeId) return (
    <div className="max-w-5xl mx-auto text-paper-600/70">Cargando...</div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-display text-2xl font-semibold tracking-tight mb-6">Pedidos</h1>
      <div className="bg-white rounded-xl border border-paper-200 overflow-hidden">
        <OrderList storeId={storeId} slug={params.slug} />
      </div>
    </div>
  );
}
