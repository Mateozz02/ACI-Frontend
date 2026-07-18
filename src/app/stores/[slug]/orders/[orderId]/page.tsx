"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { OrderDetail } from "@/features/orders/components/OrderDetail";

export default function OrderDetailPage() {
  const params = useParams<{ slug: string }>();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/stores/${params.slug}/orders`} className="text-sm text-yellow-700/70 hover:text-yellow-950 transition-colors">
          ← Volver a pedidos
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <OrderDetail />
      </div>
    </div>
  );
}
