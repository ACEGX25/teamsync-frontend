"use client";

import { useEffect, useState } from "react";

import Navbar        from "@/shared/Navbar";
import Sidebar       from "@/shared/Sidebar";
import QuickActions  from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import ActivityFeed  from "@/components/dashboard/ActivityFeed";
import StatsRow      from "@/components/dashboard/StatsRow";
import MeetingRoom from "@/components/meeting/meetingRoom";
import { authApi, type AuthUser } from "@/utils/api";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive]       = useState("dashboard");
  const [showMeeting, setShowMeeting] = useState(false);
  const [user, setUser]           = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const cachedUser = localStorage.getItem("userDetails");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser) as AuthUser);
        }

        const response = await authApi.getMe();
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch {
        // Keep cached values if /me fails (e.g., expired token).
      } finally {
        setLoadingUser(false);
      }
    };

    hydrateUser();
  }, []);

  const userName = user?.fullName || "there";
  const userEmail = user?.email || "";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const wsBaseUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api")
      .replace(/^http/, "ws")
      .replace(/\/api\/?$/, "");
  const meetingId = "teamsync-live-room";
  const meetingWsUrl = `${wsBaseUrl}/meetings/${meetingId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">

      <Navbar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onNewMeeting={() => setShowMeeting(true)}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="flex">

        <Sidebar
          collapsed={collapsed}
          active={active}
          onNavClick={(id) => {
            setShowMeeting(false);
            setActive(id);
          }}
        />

        <main
          className={
            showMeeting
              ? "flex-1 min-h-[calc(100vh-64px)] p-0"
              : "flex-1 min-h-[calc(100vh-64px)] p-6 lg:p-8"
          }
        >

          {showMeeting ? (
            <MeetingRoom
              meetingId={meetingId}
              wsUrl={meetingWsUrl}
              currentUser={{
                id: String(user?.userId ?? "guest"),
                name: userName,
                initials: userInitials,
                color: "var(--color-db-stats-members-icon)",
              }}
              onLeave={() => setShowMeeting(false)}
            />
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back, {userName}.</h1>
                <p className="mt-1.5 text-sm text-slate-600">
                  {loadingUser
                    ? "Loading your workspace details..."
                    : userEmail
                      ? `Signed in as ${userEmail}. You are all set to collaborate.`
                      : "Your workspace details are ready."}
                </p>
              </div>
              <StatsRow />

              <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <QuickActions />
                <RecentMessages />
                <ActivityFeed />
              </div>
            </>
          )}

          

        </main>
      </div>

    </div>
  );
}