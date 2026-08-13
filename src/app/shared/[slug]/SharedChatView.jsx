"use client";

// Client wrapper — ChatMessage is a client component (it has hover state,
// clipboard hooks, etc). We just map the redacted messages through it in
// a read-only shell. No auth, no store, no streaming.

import ChatMessage from "@/components/carouselComponents/chatMessage/chatMessage";
import "@/components/carouselComponents/cc.css";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function SharedChatView({ session, messages }) {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <header className="mx-auto max-w-3xl px-4 pt-8 pb-4 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {session.title || "Untitled chat"}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Shared conversation · read-only
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
                >
                    Try TWIQ <ArrowUpRight size={14} />
                </Link>
            </header>

            <div className="mx-auto max-w-3xl px-4 pb-16">
                <div className="chats_area_container">
                    {messages.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-12 text-center">
                            No messages in this shared chat.
                        </p>
                    ) : (
                        messages.map((m) => (
                            <ChatMessage
                                key={m.id}
                                chat={m}
                                assistantSlug={session.assistant_slug}
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
