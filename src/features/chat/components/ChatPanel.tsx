"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getConversations } from "../api";
import type { ConversationSummary } from "../types";

export function ChatPanel() {
  const params = useParams<{ slug: string; phone?: string }>();
  const router = useRouter();
  const [storeId, setStoreId] = useState<string>("");
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const activePhone = params.phone ? decodeURIComponent(params.phone) : null;

  // Get store ID from slug — reuse existing API
  useEffect(() => {
    import("@/features/stores/api").then((m) => {
      m.getStoreBySlug(params.slug).then((s) => setStoreId(s.id));
    });
  }, [params.slug]);

  const loadConversations = useCallback(async () => {
    if (!storeId) return;
    try {
      const data = await getConversations(storeId);
      setConversations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  return (
    <div className="w-full md:w-72 bg-yellow-50/50 border-r border-yellow-100 flex flex-col h-full">
      <div className="p-4 border-b border-yellow-100">
        <h3 className="font-semibold text-yellow-950">Conversaciones</h3>
        <p className="text-xs text-yellow-700/60 mt-1">
          {conversations.length} activas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-yellow-700/50 py-8 text-sm">Cargando...</p>
        ) : conversations.length === 0 ? (
          <p className="text-center text-yellow-700/50 py-8 text-sm">
            Sin conversaciones aún
          </p>
        ) : (
          conversations.map((c) => (
            <button
              key={c.phone}
              onClick={() => router.push(`/stores/${params.slug}/chats/${encodeURIComponent(c.phone)}`)}
              className={`w-full text-left px-4 py-3 border-b border-yellow-50 hover:bg-yellow-100/50 transition-colors ${
                activePhone === c.phone ? "bg-yellow-100" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-950 truncate max-w-[140px]">
                  {c.phone}
                </span>
                <span className="text-xs text-yellow-700/40">
                  {new Date(c.last_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-xs text-yellow-700/60 truncate mt-0.5">
                {c.last_role === "assistant" && "🤖 "}
                {c.last_role === "store" && "🏪 "}
                {c.last_message?.slice(0, 40)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
