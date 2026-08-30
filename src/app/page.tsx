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

  const tierBadgeStyle =
    user?.tier === "enterprise" ? "bg-paper-950 text-paper-50" :
    user?.tier === "pro" ? "bg-signal-50 text-signal-700" :
    "bg-paper-100 text-paper-700";

  return (
    <main className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-paper-950">OrderFlow</h1>
            <p className="text-paper-700/70 mt-1">Elegí una tienda para gestionar sus pedidos</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tierBadgeStyle}`}>
              {tierInfo.label}
            </span>
            <button
              onClick={logout}
              className="text-sm text-paper-700/60 hover:text-paper-950"
            >
              Salir
            </button>
          </div>
        </header>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-mono text-paper-700/60">
            {stores.length} / {tierInfo.limit ?? "∞"} tiendas
          </p>
          {limitReached && (
            <p className="text-sm text-clay-600 font-medium">
              Actualizá tu plan para administrar más tiendas
            </p>
          )}
        </div>

        {stores.length === 0 ? (
          <div className="bg-white rounded-xl border border-paper-200 p-8 text-center shadow-sm">
            <p className="text-paper-700/60">No hay tiendas creadas todavía</p>
            <p className="text-sm text-paper-700/60 mt-1">Usá POST /api/stores para crear la primera</p>
          </div>
        ) : (
          <div className="rounded-xl border border-paper-200 bg-white shadow-sm divide-y divide-paper-100 overflow-hidden">
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.slug}/orders`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-paper-50 transition-colors group"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-signal-50 text-signal-700 font-display font-semibold text-lg shrink-0">
                  {store.name.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-paper-950 truncate">{store.name}</div>
                  <div className="text-sm font-mono text-paper-700/60 truncate">{store.phone}</div>
                </div>
                <span className="text-paper-300 group-hover:text-signal-400 transition-colors" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
