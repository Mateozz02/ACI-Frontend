"use client";

import { ChatPanel } from "@/features/chat/components/ChatPanel";

export default function StoreChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 -m-6 md:-m-8">
      <ChatPanel />
      <main className="flex-1 min-h-0 overflow-auto bg-white">
        {children}
      </main>
    </div>
  );
}
