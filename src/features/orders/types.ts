export type OrderStatus =
  | "received"
  | "parsed"
  | "confirmed"
  | "awaiting_payment"
  | "payment_received"
  | "verified"
  | "completed"
  | "cancelled"
  | "failed";

export type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  store_id: string;
  customer_name: string | null;
  customer_phone: string;
  status: OrderStatus;
  total_amount: number | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string | null;
  completed_at: string | null;
};