"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStoreBySlug } from "@/features/stores/api";
import { ChatThread } from "@/features/chat/components/ChatThread";

export default function ChatPage() {
  const params = useParams<{ slug: string; phone: string }>();
  const phone = decodeURIComponent(params.phone);
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    getStoreBySlug(params.slug).then((s) => setStoreId(s.id));
  }, [params.slug]);

  if (!storeId) {
    return (
      <div className="flex items-center justify-center h-full text-paper-700/60">
        Cargando...
      </div>
    );
  }

  return <ChatThread storeId={storeId} phone={phone} />;
}
