export type WhatsAppSession = {
  store_id: string;
  session_name?: string;
  session_id?: string;
  status: "created" | "qr_ready" | "ready" | "disconnected" | "deleted";
  phone?: string;
  push_name?: string;
  connected_at?: string;
  last_active?: string;
};

export type QRResponse = {
  store_id: string;
  qr_code: string;
  status: string;
};
