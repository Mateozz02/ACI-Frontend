import { getAuthHeaders } from "@/shared/lib/api";
import type { WhatsAppSession, QRResponse } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const headers = () => ({ "Content-Type": "application/json", ...getAuthHeaders() });

export async function createSession(storeId: string): Promise<WhatsAppSession> {
  console.log('[API] createSession called with storeId:', storeId);
  const res = await fetch(`${BASE}/api/whatsapp/${storeId}/create-session`, { method: "POST", headers: headers() });
  console.log('[API] createSession response status:', res.status);
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
}

export async function startSession(storeId: string): Promise<WhatsAppSession> {
  console.log('[API] startSession called with storeId:', storeId);
  const res = await fetch(`${BASE}/api/whatsapp/${storeId}/start`, { method: "POST", headers: headers() });
  console.log('[API] startSession response status:', res.status);
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
}

export async function getQR(storeId: string): Promise<QRResponse> {
  console.log('[API] getQR called with storeId:', storeId);
  const res = await fetch(`${BASE}/api/whatsapp/${storeId}/qr`, { headers: headers() });
  console.log('[API] getQR response status:', res.status);
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
}

export async function getStatus(storeId: string): Promise<WhatsAppSession> {
  const res = await fetch(`${BASE}/api/whatsapp/${storeId}/status`, { headers: headers() });
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
}

export async function deleteSession(storeId: string): Promise<{ status: string }> {
  const res = await fetch(`${BASE}/api/whatsapp/${storeId}/session`, { method: "DELETE", headers: headers() });
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
}
