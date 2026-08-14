"use client";

import { useState, useEffect } from "react";

type Props = {
  qrCode: string;
  onRefresh: () => void;
};

export function QRCodeDisplay({ qrCode, onRefresh }: Props) {
  const [countdown, setCountdown] = useState(20);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setCountdown(20);
    setExpired(false);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrCode]);

  return (
    <div className="text-center">
      <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
      {expired ? (
        <button onClick={onRefresh} className="mt-3 px-4 py-2 text-sm bg-yellow-400 rounded-lg">
          Actualizar QR
        </button>
      ) : (
        <p className="text-sm text-yellow-700/60 mt-2">Expira en {countdown}s</p>
      )}
    </div>
  );
}
