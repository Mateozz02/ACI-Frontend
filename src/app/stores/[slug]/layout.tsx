import { Sidebar } from "@/shared/components/Sidebar";
import { getStoreBySlug } from "@/features/stores/api";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0">
      <Sidebar slug={slug} storeName={store.name} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
