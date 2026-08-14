import { getAuthHeaders } from "@/shared/lib/api";
import type { ConversationSummary, ChatMessage } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getConversations(storeId: string): Promise<ConversationSummary[]> {
  const res = await fetch(`${BASE}/api/stores/${storeId}/conversations`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load conversations");
  return res.json();
}

export async function getConversation(storeId: string, phone: string): Promise<ChatMessage[]> {
  const res = await fetch(`${BASE}/api/stores/${storeId}/conversations/${encodeURIComponent(phone)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load messages");
  return res.json();
}

export async function sendToCustomer(
  storeId: string,
  phone: string,
  data: { content: string; image_url?: string },
): Promise<{ status: string }> {
  const res = await fetch(`${BASE}/api/stores/${storeId}/conversations/${encodeURIComponent(phone)}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
}
