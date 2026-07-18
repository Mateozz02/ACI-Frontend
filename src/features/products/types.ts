export type Product = {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  unit: string;
  price: number;
  category: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;
};