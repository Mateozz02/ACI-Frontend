"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Store } from "@/features/stores/types";
import { getStoreBySlug } from "@/features/stores/api";
import { StoreSettingsForm } from "@/features/stores/components/StoreSettingsForm";

export default function SettingsPage() {
  const params = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    getStoreBySlug(params.slug).then(setStore);
  }, [params.slug]);

  if (!store) return (
    <div className="max-w-2xl mx-auto text-gray-400">Cargando...</div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Configuración</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <StoreSettingsForm store={store} onSaved={() => getStoreBySlug(params.slug).then(setStore)} />
      </div>
    </div>
  );
}
