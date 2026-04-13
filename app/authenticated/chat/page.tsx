"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatProvider } from '@/context/ChatContext';
import { ChatInterface } from '@/components/chat/ChatInterface';
import type { AuthUser } from '@/utils/api';
import Navbar from "@/shared/Navbar";
import Sidebar from "@/shared/Sidebar";

export default function ChatPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("userDetails");

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user details", e);
      }
    }
  }, []);

  if (!isClient) return null; // Wait for hydration

  const userName = user?.fullName || "there";
  const userEmail = user?.email || "";
  const activeToken = token || "missing-token";

  return (
    <div className="relative flex h-screen w-full min-w-0 flex-col overflow-hidden bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_42%,var(--color-bg-page-end)_100%)] font-[var(--font-base)] text-[var(--color-text-primary)]">
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[var(--gradient-db-glow-left)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[var(--gradient-db-glow-right)] blur-3xl" />

      <Navbar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          active="messages"
          onNavClick={(id) => {
            if (id !== "messages") {
              router.push("/authenticated/dashboard");
            }
          }}
        />
        <main className="relative flex-1 overflow-hidden sm:p-2 flex flex-col">
          <div className="flex-1 flex w-full flex-col overflow-hidden rounded-[24px] border border-[var(--color-divider)] bg-[var(--color-db-surface-glass)] p-0 shadow-[var(--shadow-db-hero)] backdrop-blur-[2px]">
            <ChatProvider
              accessToken={activeToken}
              currentUser={user || { userId: 0, email: "", fullName: "" } as any}
              chatServiceUrl={process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || 'http://localhost:3001'}
            >
              <ChatInterface />
            </ChatProvider>
          </div>
        </main>
      </div>
    </div>
  );
}