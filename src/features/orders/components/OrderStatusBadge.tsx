import type { OrderStatus } from "../types";

// The real order journey, in the order stores actually see it happen.
const JOURNEY: OrderStatus[] = [
  "received",
  "parsed",
  "confirmed",
  "awaiting_payment",
  "payment_received",
  "verified",
  "completed",
];

const statusLabels: Record<OrderStatus, string> = {
  received: "Recibido",
  parsed: "Parseado",
  confirmed: "Confirmado",
  awaiting_payment: "Esperando pago",
  payment_received: "Pago recibido",
  verified: "Verificado",
  completed: "Completado",
  cancelled: "Cancelado",
  failed: "Fallido",
};

type Props = { status: OrderStatus };

export function OrderStatusBadge({ status }: Props) {
  if (status === "cancelled" || status === "failed") {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-medium text-paper-950">
        <span
          className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] leading-none text-white ${
            status === "failed" ? "bg-red-500" : "bg-clay-600"
          }`}
          aria-hidden="true"
        >
          ✕
        </span>
        {statusLabels[status]}
      </span>
    );
  }

  const step = JOURNEY.indexOf(status);

  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-paper-950">
      <span className="inline-flex items-center gap-0.5" aria-hidden="true" title={`Paso ${step + 1} de ${JOURNEY.length}`}>
        {JOURNEY.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-2.5 rounded-full transition-colors ${
              i > step
                ? "bg-paper-200"
                : i === JOURNEY.length - 1
                ? "bg-signal-500"
                : "bg-signal-400/70"
            }`}
          />
        ))}
      </span>
      {statusLabels[status]}
    </span>
  );
}
