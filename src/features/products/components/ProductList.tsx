"use client";

import { useEffect, useState } from "react";
import type { Product } from "../types";
import { getProductsByStore } from "../api";

export function ProductList({ storeId, onEdit }: { storeId: string; onEdit?: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProductsByStore(storeId)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [storeId]);

  // Filtro local — no llama a la API por cada tecla
  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : products;

  if (loading) return <div className="p-8 text-center text-yellow-700/60">Cargando productos...</div>;

  return (
    <div>
      <div className="px-5 py-3 border-b border-yellow-100">
        <input
          type="text"
          placeholder="Buscar por nombre o categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-1.5 text-sm border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
        />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-yellow-100 bg-yellow-50/50">
            <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Nombre</th>
            <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap text-right">Precio</th>
            <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Unidad</th>
            <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Categoria</th>
            <th className="px-5 py-3 font-medium text-yellow-800/70 whitespace-nowrap">Disponible</th>
            {onEdit && <th className="px-5 py-3"></th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr
              key={product.id}
              className="border-b border-yellow-50 last:border-0 hover:bg-yellow-50/50 transition-colors"
            >
              <td className="px-5 py-3 whitespace-nowrap font-medium text-yellow-950">{product.name}</td>
              <td className="px-5 py-3 whitespace-nowrap text-right tabular-nums text-yellow-950">
                ${product.price}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-yellow-700/60">{product.unit}</td>
              <td className="px-5 py-3 whitespace-nowrap text-yellow-700/60">
                {product.category ?? "—"}
              </td>
              <td className="px-5 py-3 whitespace-nowrap">
                {product.is_available ? (
                  <span className="text-emerald-600 text-xs font-medium">Activo</span>
                ) : (
                  <span className="text-yellow-300 text-xs">Inactivo</span>
                )}
              </td>
              {onEdit && (
                <td className="px-5 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-yellow-600 hover:text-yellow-800 transition-colors text-sm"
                  >
                    Editar
                  </button>
                </td>
              )}
            </tr>
          ))}
          {filtered.length === 0 && !loading && (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-yellow-700/60">
                {search ? "Sin resultados" : "No hay productos"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
