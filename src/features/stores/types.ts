export type Store = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string | null;
  description: string | null;
  greeting_message: string | null;
  payment_instructions: string | null;
  cancellation_policy: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
};
