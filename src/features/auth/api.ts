import type { AuthResponse } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function extractError(data: unknown): string {
  if (!data || typeof data !== "object") return "Error inesperado";
  const d = data as Record<string, unknown>;
  if (typeof d.detail === "string") return d.detail;
  if (Array.isArray(d.detail) && d.detail.length > 0) {
    const first = d.detail[0];
    if (typeof first === "object" && first !== null && "msg" in first) {
      return (first as Record<string, string>).msg;
    }
    return String(d.detail[0]);
  }
  if (typeof d.message === "string") return d.message;
  return "Error inesperado";
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(extractError(err) || "Email o contraseña incorrectos");
  }
  return res.json();
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(extractError(err) || "Error al crear cuenta");
  }
  return res.json();
}
