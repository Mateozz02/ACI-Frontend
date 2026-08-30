"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { WhatsAppSession } from "../types";
import { createSession, startSession, getQR, getStatus, deleteSession } from "../api";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { ConnectionStatus } from "./ConnectionStatus";

export function WhatsAppConnection({ storeId, hasSession }: { storeId: string; hasSession: boolean }) {
  const [active, setActive] = useState(hasSession);
  const [status, setStatus] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [error, setError] = useState("");
  const [sessionExists, setSessionExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = undefined;
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const s = await getStatus(storeId);
      setSession(s);
      setStatus(s.status);
      if (s.status !== "qr_ready") stopPolling();
    } catch {
      stopPolling();
    }
  }, [storeId, stopPolling]);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const qr = await getQR(storeId);
      setQrCode(qr.qr_code);
      setStatus("qr_ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, [storeId]);

  const handleConnect = async () => {
    console.log('[WhatsApp] handleConnect called, storeId:', storeId);
    setLoading(true);
    setError("");
    try {
      console.log('[WhatsApp] Calling createSession...');
      await createSession(storeId);
      console.log('[WhatsApp] createSession done, calling startSession...');
      await startSession(storeId);
      console.log('[WhatsApp] startSession done, checking status...');

      // Check if session is already authenticated (no QR needed)
      const s = await getStatus(storeId);
      console.log('[WhatsApp] status:', s.status);
      setSession(s);
      setStatus(s.status);
      setActive(true);

      if (s.status === "ready") {
        // Already authenticated, show connected state
        return;
      }

      if (s.status === "qr_ready") {
        const qr = await getQR(storeId);
        setQrCode(qr.qr_code);
        pollRef.current = setInterval(fetchStatus, 3000);
        return;
      }

      // Other states — start polling
      pollRef.current = setInterval(fetchStatus, 3000);
    } catch (e) {
      console.error('[WhatsApp] Error:', e);
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg);
      if (msg.includes("already has")) setSessionExists(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError("");
    stopPolling();
    try {
      await deleteSession(storeId);
      setActive(false);
      setStatus(null);
      setQrCode(null);
      setSession(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async () => {
    setLoading(true);
    setError("");
    setSessionExists(false);
    stopPolling();
    try {
      try {
        await deleteSession(storeId);
      } catch {
        // session may already be gone from OpenWA, proceed anyway
      }
      await createSession(storeId);
      await startSession(storeId);

      // Check if session is already authenticated
      const s = await getStatus(storeId);
      setSession(s);
      setStatus(s.status);
      setActive(true);

      if (s.status === "ready") return;
      if (s.status === "qr_ready") {
        const qr = await getQR(storeId);
        setQrCode(qr.qr_code);
      }
      pollRef.current = setInterval(fetchStatus, 3000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg);
      if (msg.includes("already has")) setSessionExists(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasSession) return;

    const init = async () => {
      try {
        const s = await getStatus(storeId);
        setSession(s);
        setStatus(s.status);

        if (s.status === "qr_ready") {
          const qr = await getQR(storeId);
          setQrCode(qr.qr_code);
          pollRef.current = setInterval(fetchStatus, 3000);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    };

    init();
    return stopPolling;
  }, [hasSession, storeId, fetchStatus, stopPolling]);

  useEffect(() => {
    return stopPolling;
  }, [stopPolling]);

  if (!active) {
    return (
      <div className="text-center py-8">
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <p className="text-paper-700/60 mb-4">No hay WhatsApp configurado para esta tienda</p>
        <button onClick={sessionExists ? handleReplace : handleConnect} disabled={loading}
          className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500 disabled:opacity-50">
          {loading ? (sessionExists ? "Reemplazando..." : "Creando...") : (sessionExists ? "Reemplazar sesion" : "Conectar WhatsApp")}
        </button>
      </div>
    );
  }

  if (status === "qr_ready" && qrCode) {
    return <QRCodeDisplay qrCode={qrCode} onRefresh={refresh} />;
  }

  if (status === "ready" && session) {
    return (
      <div className="text-center py-4">
        <ConnectionStatus
          status={session.status}
          phone={session.phone}
          pushName={session.push_name}
          connectedAt={session.connected_at}
        />
        <button onClick={handleDisconnect} disabled={loading}
          className="mt-4 px-4 py-2 text-sm text-red-700 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">
          {loading ? "Desconectando..." : "Desconectar"}
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        {sessionExists ? (
          <button onClick={handleReplace} disabled={loading}
            className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500">
            {loading ? "Reemplazando..." : "Reemplazar sesion"}
          </button>
        ) : (
          <button onClick={handleConnect} disabled={loading}
            className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500">
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (status === "created") {
    return (
      <div className="text-center py-8">
        <p className="text-paper-700/60 mb-4">La sesion fue creada pero no se pudo iniciar</p>
        <button onClick={handleConnect} disabled={loading}
          className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500 disabled:opacity-50">
          {loading ? "Iniciando..." : "Iniciar sesion"}
        </button>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div className="text-center py-8">
        <p className="text-paper-700/60 mb-4">La sesion de WhatsApp se desconecto</p>
        <button onClick={handleConnect} disabled={loading}
          className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500 disabled:opacity-50">
          {loading ? "Reconectando..." : "Reconectar WhatsApp"}
        </button>
      </div>
    );
  }

  if (status === "deleted") {
    return (
      <div className="text-center py-8">
        <p className="text-paper-700/60 mb-4">La sesion de WhatsApp expiro o fue eliminada</p>
        <button onClick={handleConnect} disabled={loading}
          className="px-4 py-2 text-sm font-medium text-paper-950 bg-signal-400 rounded-lg hover:bg-signal-500 disabled:opacity-50">
          {loading ? "Creando..." : "Conectar WhatsApp"}
        </button>
      </div>
    );
  }

  return <p className="text-center text-paper-700/60 py-4">Cargando...</p>;
}
