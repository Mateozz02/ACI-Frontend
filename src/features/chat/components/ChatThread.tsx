"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getConversation, sendToCustomer } from "../api";
import type { ChatMessage } from "../types";

export function ChatThread({ storeId, phone }: { storeId: string; phone: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const msgs = await getConversation(storeId, phone);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    }
  }, [storeId, phone]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await sendToCustomer(storeId, phone, { content: text });
      setInput("");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al enviar");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-paper-100 bg-paper-50/30">
        <span className="text-sm font-medium text-paper-950">{phone}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-paper-700/40 py-10 text-sm">
            Sin mensajes aún
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-signal-400 text-paper-950 rounded-br-md"
                  : msg.role === "store"
                  ? "bg-clay-100 text-clay-700 rounded-bl-md border border-clay-600/15"
                  : "bg-paper-50 text-paper-950 rounded-bl-md border border-paper-100"
              }`}
            >
              {msg.role === "store" && (
                <span className="text-xs font-medium text-clay-700 block mb-1">🏪 Tienda</span>
              )}
              {msg.image_url && (
                <img
                  src={msg.image_url}
                  alt="Imagen"
                  className="max-w-[200px] rounded-lg mb-2"
                />
              )}
              {msg.content && (
                <span className="whitespace-pre-wrap break-words">{msg.content}</span>
              )}
              <span className="block text-xs text-paper-700/30 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-paper-100 p-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí un mensaje..."
          className="flex-1 px-3 py-2 text-sm border border-paper-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-paper-200 focus:border-signal-400"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500 disabled:opacity-50 transition-colors"
        >
          {sending ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
