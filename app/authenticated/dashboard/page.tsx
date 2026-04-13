"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRouter } from "next/navigation";

import Navbar from "@/shared/Navbar";
import Sidebar from "@/shared/Sidebar";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatsRow from "@/components/dashboard/StatsRow";
import PageRenderer from "@/shared/PageRenderer";
import { authApi, type AuthUser } from "@/utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const handleStartMeeting = () => {
    const generatedId = crypto.randomUUID();
    router.push(`/authenticated/meeting?meetingId=${generatedId}`);
  };

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const cachedUser = localStorage.getItem("userDetails");
        if (cachedUser) setUser(JSON.parse(cachedUser) as AuthUser);

        const response = await authApi.getMe();
        if (response.data?.user) setUser(response.data.user);
      } catch {
        // Keep cached values if /me fails
      } finally {
        setLoadingUser(false);
      }
    };

    hydrateUser();
  }, []);

  const userName = user?.fullName || "there";
  const userEmail = user?.email || "";

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
          active={active}
          onNavClick={(id) => {
            if (id === "messages") {
              router.push("/authenticated/chat");
            } else {
              setActive(id);
            }
          }}
        />

        <main className="db-main">

          <div>
            <h1 className="db-welcome-title">Welcome Back, {userName}.</h1>
            <p className="db-welcome-sub">
              {loadingUser
                ? "Loading your workspace details..."
                : userEmail
                  ? `Signed in as ${userEmail}. You are all set to collaborate.`
                  : "Your workspace details are ready."}
            </p>
          </div>
          <StatsRow />

          <div className="db-content-grid">
            
            <QuickActions />
            <RecentMessages />
            <ActivityFeed />
          </div>

          

        </main>
      </div>
    </div>
  );
}