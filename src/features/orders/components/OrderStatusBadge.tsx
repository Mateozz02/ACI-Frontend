import type { OrderStatus } from "../types";

const statusStyle: Record<OrderStatus, string> = {
  received:           "bg-slate-50 text-slate-600 ring-slate-200",
  parsed:             "bg-sky-50 text-sky-700 ring-sky-200",
  confirmed:          "bg-emerald-50 text-emerald-700 ring-emerald-200",
  awaiting_payment:   "bg-amber-50 text-amber-700 ring-amber-200",
  payment_received:   "bg-violet-50 text-violet-700 ring-violet-200",
  verified:           "bg-teal-50 text-teal-700 ring-teal-200",
  completed:          "bg-stone-50 text-stone-600 ring-stone-200",
  cancelled:          "bg-rose-50 text-rose-700 ring-rose-200",
  failed:             "bg-red-50 text-red-700 ring-red-200",
};

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

const statusDot: Record<OrderStatus, string> = {
  received:           "bg-slate-400",
  parsed:             "bg-sky-400",
  confirmed:          "bg-emerald-400",
  awaiting_payment:   "bg-amber-400",
  payment_received:   "bg-violet-400",
  verified:           "bg-teal-400",
  completed:          "bg-stone-400",
  cancelled:          "bg-rose-400",
  failed:             "bg-red-500",
};

type Props = { status: OrderStatus };

export function OrderStatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusStyle[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {statusLabels[status]}
    </span>
  );
}
