"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Store } from "@/features/stores/types";
import { getStoreBySlug } from "@/features/stores/api";
import { StoreSettingsForm } from "@/features/stores/components/StoreSettingsForm";
import { WhatsAppConnection } from "@/features/whatsapp/components/WhatsAppConnection";

type Tab = "general" | "whatsapp";

export default function SettingsPage() {
  const params = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [tab, setTab] = useState<Tab>("general");

  useEffect(() => {
    getStoreBySlug(params.slug).then(setStore);
  }, [params.slug]);

  if (!store) return (
    <div className="max-w-2xl mx-auto text-paper-600/70">Cargando...</div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-semibold tracking-tight mb-6">Configuración</h1>

      <div className="flex gap-1 mb-4 border-b border-paper-200">
        <button onClick={() => setTab("general")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "general"
              ? "bg-white border border-b-white -mb-px text-paper-950"
              : "text-paper-700/60 hover:text-paper-950"
          }`}>
          General
        </button>
        <button onClick={() => setTab("whatsapp")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            tab === "whatsapp"
              ? "bg-white border border-b-white -mb-px text-paper-950"
              : "text-paper-700/60 hover:text-paper-950"
          }`}>
          WhatsApp
        </button>
      </div>

      <div className="bg-white rounded-xl border border-paper-200 overflow-hidden">
        {tab === "general" ? (
          <StoreSettingsForm store={store} onSaved={() => getStoreBySlug(params.slug).then(setStore)} />
        ) : (
          <div className="p-5">
            <WhatsAppConnection storeId={store.id} hasSession={!!store.openwa_session_name} />
          </div>
        )}
      </div>
    </div>
  );
}
