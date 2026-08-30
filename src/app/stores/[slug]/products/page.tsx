"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getStoreBySlug } from "@/features/stores/api";
import type { Product } from "@/features/products/types";
import { ProductList } from "@/features/products/components/ProductList";
import { ProductForm } from "@/features/products/components/ProductForm";

export default function ProductsPage() {
  const params = useParams<{ slug: string }>();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getStoreBySlug(params.slug).then((s) => setStoreId(s.id));
  }, [params.slug]);

  const handleDone = () => {
    setShowForm(false);
    setEditingProduct(null);
    setRefreshKey((k) => k + 1);
  };

  if (!storeId) return (
    <div className="max-w-5xl mx-auto text-paper-600/70">Cargando...</div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Productos</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-paper-950 rounded-lg hover:bg-paper-800">
            + Nuevo producto
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-paper-200 overflow-hidden">
        {showForm && (
          <div className="border-b border-paper-100 bg-paper-50/60">
            <ProductForm storeId={storeId} product={editingProduct ?? undefined} onDone={handleDone} />
          </div>
        )}
        <ProductList key={refreshKey} storeId={storeId}
          onEdit={(p) => { setEditingProduct(p); setShowForm(true); }} />
      </div>
    </div>
  );
}
