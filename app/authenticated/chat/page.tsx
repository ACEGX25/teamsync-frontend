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
    <div className="db-root">
      <Navbar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="db-body">
        <Sidebar
          collapsed={collapsed}
          active="messages"
          onNavClick={(id) => {
            if (id !== "messages") {
              router.push("/authenticated/dashboard");
            }
          }}
        />
        <main className="db-main" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: "100%", width: "100%" }}>
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