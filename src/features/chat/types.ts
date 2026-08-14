export type ConversationSummary = {
  phone: string;
  last_message: string;
  last_role: string;
  last_at: string;
  message_count: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "store";
  content: string | null;
  image_url: string | null;
  intent: string | null;
  order_id: string | null;
  created_at: string;
};
