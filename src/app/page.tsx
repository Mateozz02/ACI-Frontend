"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";
import { getStores } from "@/features/stores/api";
import type { Store } from "@/features/stores/types";

const TIER_LABELS: Record<string, { label: string; limit: number | null }> = {
  free: { label: "Free", limit: 1 },
  pro: { label: "Pro", limit: 3 },
  enterprise: { label: "Enterprise", limit: null },
};

export default function Home() {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    getStores().then(setStores);
  }, []);

  const tierInfo = TIER_LABELS[user?.tier ?? "free"] ?? TIER_LABELS.free;
  const limitReached = tierInfo.limit !== null && stores.length >= tierInfo.limit;

  return (
    <main className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-yellow-950">OrderFlow</h1>
            <p className="text-yellow-700/70 mt-1">Selecciona una tienda para gestionar pedidos</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user?.tier === "enterprise" ? "bg-purple-100 text-purple-800" :
              user?.tier === "pro" ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {tierInfo.label}
            </span>
            <button
              onClick={logout}
              className="text-sm text-yellow-700/60 hover:text-yellow-950"
            >
              Salir
            </button>
          </div>
        </header>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-yellow-700/60">
            {stores.length} de {tierInfo.limit ?? "∞"} tiendas
          </p>
          {limitReached && (
            <p className="text-sm text-orange-600 font-medium" style={{color: "#FFBF00 "}}>
              Actualiza tu plan para administrar mas tiendas!
            </p>
          )}
        </div>

        {stores.length === 0 ? (
          <div className="bg-white rounded-xl border border-yellow-200 p-8 text-center shadow-sm">
            <p className="text-yellow-700/60">No hay tiendas creadas</p>
            <p className="text-sm text-yellow-700/60 mt-1">Usa POST /api/stores para crear una</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.slug}/orders`}
                className="bg-white border border-yellow-200 rounded-xl p-5 hover:border-yellow-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg text-yellow-950">{store.name}</div>
                    <div className="text-sm text-yellow-700/60">{store.phone}</div>
                  </div>
                  <span className="text-yellow-400 text-xl">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
