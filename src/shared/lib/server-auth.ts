import { cookies } from "next/headers";

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const token = await getServerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
