const STATUS_COLORS: Record<string, string> = {
  ready: "bg-green-100 text-green-800",
  qr_ready: "bg-yellow-100 text-yellow-800",
  created: "bg-gray-100 text-gray-800",
  disconnected: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  ready: "Conectado",
  qr_ready: "Esperando QR",
  created: "Creado",
  disconnected: "Desconectado",
};

type Props = {
  status: string;
  phone?: string;
  pushName?: string;
  connectedAt?: string;
};

export function ConnectionStatus({ status, phone, pushName, connectedAt }: Props) {
  return (
    <div className="space-y-2">
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800"}`}>
        {STATUS_LABELS[status] ?? status}
      </span>
      {phone && <p className="text-sm text-yellow-700/80">Número: {phone}</p>}
      {pushName && <p className="text-sm text-yellow-700/80">Nombre: {pushName}</p>}
      {connectedAt && <p className="text-sm text-yellow-700/60">Conectado: {new Date(connectedAt).toLocaleString()}</p>}
    </div>
  );
}
