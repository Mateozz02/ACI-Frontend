"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getStoreBySlug } from "@/features/stores/api";
import { getAuthHeaders } from "@/shared/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export default function TestChatPage() {
  const params = useParams<{ slug: string }>();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStoreBySlug(params.slug).then((s) => {
      setStoreId(s.id);
      setStoreName(s.name);
    });
  }, [params.slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || !storeId || loading) return;

    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE}/api/test/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ message: text, store_id: storeId }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const botMsg: ChatMessage = { role: "bot", text: data.response ?? "Sin respuesta" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: e instanceof Error ? e.message : "Error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!storeId) {
    return <div className="max-w-2xl mx-auto text-yellow-700/60">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-full">
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        Test Chat &mdash; {storeName}
      </h1>

      <div className="flex-1 bg-white rounded-xl border border-yellow-200 overflow-hidden flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px] max-h-[60vh]">
          {messages.length === 0 && (
            <p className="text-center text-yellow-700/50 mt-10">
              En&shy;via mensajes de prue&shy;ba para simular una con&shy;ver&shy;sacion de WhatsApp
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-yellow-400 text-yellow-950 rounded-br-md"
                    : "bg-yellow-50 border border-yellow-100 text-yellow-950 rounded-bl-md"
                }`}
              >
                <span className="whitespace-pre-wrap break-words">{msg.text}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-yellow-50 border border-yellow-100 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-yellow-700/70">
                Escribiendo...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="border-t border-yellow-100 p-3 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: Quiero 2kg de carne molida"
            className="flex-1 px-3 py-2 text-sm border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 text-sm font-medium text-yellow-950 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
