"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1 w-full px-3 py-2 text-sm border border-paper-200 rounded-md focus:outline-none focus:ring-2 focus:ring-signal-100 focus:border-signal-400 bg-white";

  return (
    <main className="min-h-screen bg-paper-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-paper-200 p-6 w-full max-w-sm space-y-4 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-signal-400 text-paper-950 font-bold text-sm">
            OF
          </span>
          <h1 className="font-display text-xl font-semibold text-paper-950">OrderFlow</h1>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-md px-3 py-2">{error}</p>}

        <label className="block">
          <span className="text-xs font-medium text-paper-800/70">Nombre</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className={inputClass} required />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-paper-800/70">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputClass} required />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-paper-800/70">Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className={inputClass} required />
        </label>

        <button type="submit" disabled={loading}
          className="w-full py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-md hover:bg-signal-500 disabled:opacity-50 transition-colors">
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <p className="text-center text-xs text-paper-700/60">
          Ya tenés cuenta? <Link href="/login" className="text-paper-700 hover:text-paper-950 underline underline-offset-2">Ingresá</Link>
        </p>
      </form>
    </main>
  );
}
