"use client";

import { useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import type { Store } from "../types";
import { updateStore } from "../api";

type Props = {
  store: Store;
  onSaved: () => void;
};

export function StoreSettingsForm({ store, onSaved }: Props) {
  const [name, setName] = useState(store.name);
  const [phone, setPhone] = useState(store.phone);
  const [address, setAddress] = useState(store.address ?? "");
  const [description, setDescription] = useState(store.description ?? "");
  const [greeting, setGreeting] = useState(store.greeting_message ?? "");
  const [payment, setPayment] = useState(store.payment_instructions ?? "");
  const [cancellation, setCancellation] = useState(store.cancellation_policy ?? "");
  const [isActive, setIsActive] = useState(store.is_active);
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(store.chatbot_enabled);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await updateStore(store.id, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim() || null,
        description: description.trim() || null,
        greeting_message: greeting.trim() || null,
        payment_instructions: payment.trim() || null,
        cancellation_policy: cancellation.trim() || null,
        is_active: isActive,
        chatbot_enabled: isChatbotEnabled
      });
      toast.success("Cambios guardados");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full px-3 py-1.5 text-sm border border-paper-200 rounded-md focus:outline-none focus:ring-2 focus:ring-paper-200 focus:border-signal-400 bg-white";
  const labelClass = "text-xs font-medium text-paper-800/70";

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className={labelClass}>Nombre *</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className={inputClass} required />
        </label>
        <label className="block">
          <span className={labelClass}>Telefono</span>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
            className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Direccion</span>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Descripcion</span>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className={inputClass} />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Mensaje de bienvenida</span>
        <textarea rows={3} value={greeting} onChange={(e) => setGreeting(e.target.value)}
          className={inputClass} />
      </label>

      <label className="block">
        <span className={labelClass}>Instrucciones de pago</span>
        <textarea rows={3} value={payment} onChange={(e) => setPayment(e.target.value)}
          className={inputClass} />
      </label>

      <label className="block">
        <span className={labelClass}>Politica de cancelacion</span>
        <textarea rows={3} value={cancellation} onChange={(e) => setCancellation(e.target.value)}
          className={inputClass} />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-paper-300 text-signal-500 focus:ring-signal-400" />
        <span className="text-sm text-paper-800">Tienda activa</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isChatbotEnabled} onChange={(e) => setIsChatbotEnabled(e.target.checked)}
          className="rounded border-paper-300 text-signal-500 focus:ring-signal-400" />
        <span className="text-sm text-paper-800">Chatbot Activo</span>
      </label>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={saving}
          className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-md hover:bg-signal-500 disabled:opacity-50">
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
