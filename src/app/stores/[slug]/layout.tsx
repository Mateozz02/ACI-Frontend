import { Sidebar } from "@/shared/components/Sidebar";
import { getServerAuthHeaders } from "@/shared/lib/server-auth";
import type { Store } from "@/features/stores/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchStoreBySlug(slug: string): Promise<Store> {
  const headers = await getServerAuthHeaders();
  const res = await fetch(`${BASE}/api/stores/by-slug/${slug}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Store not found");
  return res.json();
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await fetchStoreBySlug(slug);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0">
      <Sidebar slug={slug} storeName={store.name} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
