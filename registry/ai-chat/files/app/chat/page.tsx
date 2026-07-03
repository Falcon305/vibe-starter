import type { Metadata } from "next";
import { Chat } from "@/components/chat/chat";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Chat" };

export default function ChatPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-2xl font-bold tracking-tight">Assistant</h1>
        <div className="mt-8">
          <Chat />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
