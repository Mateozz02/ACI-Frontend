"use client";

import { useState, type SyntheticEvent } from "react";
import type { Product } from "../types";
import { createProduct, updateProduct } from "../api";

type Props = {
  storeId: string;
  product?: Product;
  onDone: () => void;
};

export function ProductForm({ storeId, product, onDone }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [unit, setUnit] = useState(product?.unit ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [category, setCategory] = useState(product?.category ?? "");
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;
    if (price <= 0) return;

    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        unit: unit.trim(),
        price,
        category: category.trim() || null,
        is_available: isAvailable,
      };

      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct({ ...data, store_id: storeId });
      }
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-yellow-800/70">Nombre *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-1.5 text-sm border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-yellow-800/70">Unidad *</span>
          <input
            type="text"
            value={unit}
            placeholder="kg, unidad, paquete..."
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 w-full px-3 py-1.5 text-sm border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-yellow-800/70">Precio *</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full px-3 py-1.5 text-sm border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-yellow-800/70">Categoria</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full px-3 py-1.5 text-sm border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-white"
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-400"
        />
        <span className="text-sm text-yellow-800">Disponible</span>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-1.5 text-sm text-yellow-700/60 hover:text-yellow-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-1.5 text-sm font-medium text-yellow-950 bg-yellow-400 rounded-md hover:bg-yellow-500 disabled:opacity-50"
        >
          {saving ? "Guardando..." : product ? "Guardar" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
