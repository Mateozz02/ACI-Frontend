const TOKEN_KEY = "token";

export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setClientCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

export function removeClientCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function getClientToken(): string | null {
  return getClientCookie(TOKEN_KEY);
}

export function setClientToken(token: string) {
  setClientCookie(TOKEN_KEY, token);
}

export function removeClientToken() {
  removeClientCookie(TOKEN_KEY);
}

export function getClientAuthHeaders(): Record<string, string> {
  const token = getClientToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
