"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStores } from "@/features/stores/api";
import type { Store } from "@/features/stores/types";

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    getStores().then(setStores);
  }, []);

  return (
    <main className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-yellow-950">OrderFlow</h1>
          <p className="text-yellow-700/70 mt-1">Selecciona una tienda para gestionar pedidos</p>
        </header>

        {stores.length === 0 ? (
          <div className="bg-white rounded-xl border border-yellow-200 p-8 text-center shadow-sm">
            <p className="text-yellow-700/60">No hay tiendas creadas</p>
            <p className="text-sm text-yellow-700/60 mt-1">Crea una con POST /api/stores</p>
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
