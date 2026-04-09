"use client";

import { useEffect, useState } from "react";

import Navbar         from "@/shared/Navbar";
import Sidebar        from "@/shared/Sidebar";
import QuickActions   from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import ActivityFeed   from "@/components/dashboard/ActivityFeed";
import StatsRow       from "@/components/dashboard/StatsRow";
import { authApi, type AuthUser } from "@/utils/api";

export default function DashboardPage() {
  const [collapsed, setCollapsed]       = useState(false);
  const [active, setActive]             = useState("dashboard");
  const [user, setUser]                 = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser]   = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const cachedUser = localStorage.getItem("userDetails");
        if (cachedUser) setUser(JSON.parse(cachedUser) as AuthUser);

        const response = await authApi.getMe();
        if (response.data?.user) setUser(response.data.user);
      } catch {
        // Keep cached values if /me fails (e.g., expired token).
      } finally {
        setLoadingUser(false);
      }
    };

    hydrateUser();
  }, []);

  const userName  = user?.fullName || "there";
  const userEmail = user?.email    || "";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "var(--color-bg-page-mid)",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
    }}>

      <Navbar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        userName={userName}
        userEmail={userEmail}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <Sidebar
          collapsed={collapsed}
          active={active}
          onNavClick={setActive}
        />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>

          <div>
            <h1 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.5px",
              marginBottom: 4,
            }}>
              Welcome Back, {userName}.
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
              {loadingUser
                ? "Loading your workspace details..."
                : userEmail
                  ? `Signed in as ${userEmail}. You are all set to collaborate.`
                  : "Your workspace details are ready."}
            </p>
          </div>

          <StatsRow />

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr 1fr",
            gap: 20,
          }}>
            <QuickActions />
            <RecentMessages />
            <ActivityFeed />
          </div>

        </main>
      </div>
    </div>
  );
}