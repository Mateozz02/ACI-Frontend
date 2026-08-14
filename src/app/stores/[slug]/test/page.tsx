"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { getStoreBySlug } from "@/features/stores/api";
import { getAuthHeaders } from "@/shared/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  meta?: {
    intent?: string;
    total?: number;
    parsed_items?: unknown;
  };
};

export default function TestChatPage() {
  const params = useParams<{ slug: string }>();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);
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

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setReceiptFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setReceiptPreview(null);
    }
  }

  async function handleSendReceipt() {
    if (!receiptFile || !storeId || sendingReceipt) return;

    const userMsg: ChatMessage = { role: "user", text: "\uD83D\uDCCE Enviando comprobante..." };
    setMessages((prev) => [...prev, userMsg]);
    setSendingReceipt(true);

    try {
      const form = new FormData();
      form.append("file", receiptFile);
      form.append("store_id", storeId);

      const res = await fetch(`${BASE}/api/test/receipt`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        role: "bot",
        text: data.response ?? "Sin respuesta",
        meta: {
          intent: data.intent,
          parsed_items: data.parsed_items,
          total: data.total,
        },
      };
      setMessages((prev) => [...prev, botMsg]);
      setReceiptFile(null);
      setReceiptPreview(null);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: e instanceof Error ? e.message : "Error" },
      ]);
    } finally {
      setSendingReceipt(false);
    }
  }

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
      const botMsg: ChatMessage = {
        role: "bot",
        text: data.response ?? "Sin respuesta",
        meta: {
          intent: data.intent,
          parsed_items: data.parsed_items,
          total: data.total,
        },
      };
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
              Envia mensajes de prueba o un comprobante
            </p>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-yellow-400 text-yellow-950 rounded-br-md"
                  : "bg-yellow-50 border border-yellow-100 text-yellow-950 rounded-bl-md"
              }`}>
                <span className="whitespace-pre-wrap break-words">{msg.text}</span>
                {msg.meta && (
                  <div className="mt-2 pt-2 border-t border-yellow-200 text-xs text-yellow-700/70 space-y-0.5">
                    <div>Intent: {String(msg.meta.intent)}</div>
                    {msg.meta.total != null && <div>Total: ${String(msg.meta.total)}</div>}
                    {Array.isArray(msg.meta.parsed_items) && (
                      <details>
                        <summary className="cursor-pointer">Ver items</summary>
                        <pre className="mt-1 p-1 bg-yellow-100/50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(msg.meta.parsed_items, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
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
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="border-t border-yellow-100 p-3 flex gap-2 items-end"
        >
          <div className="flex-1 flex flex-col gap-2">
            {receiptPreview && (
              <div className="flex items-center gap-2 bg-yellow-50 rounded-lg p-2">
                <img src={receiptPreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
                <span className="text-xs text-yellow-700/70 truncate flex-1">{receiptFile?.name}</span>
                <button type="button" onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                  className="text-red-500 text-xs hover:underline">Quitar</button>
                <button type="button" onClick={handleSendReceipt} disabled={sendingReceipt}
                  className="px-3 py-1 text-xs font-medium text-yellow-950 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50">
                  {sendingReceipt ? "..." : "Enviar"}
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: Quiero 2kg de carne molida"
                className="flex-1 px-3 py-2 text-sm border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
                disabled={loading} />
              <label className="px-3 py-2 text-sm border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-50 text-yellow-700/70">
                📎
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button type="submit" disabled={loading || !input.trim()}
                className="px-4 py-2 text-sm font-medium text-yellow-950 bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
