"use client";

import { useEffect, useState } from "react";
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
        // Keep cached values if /me fails (e.g., expired token).
      } finally {
        setLoadingUser(false);
      }
    };

    hydrateUser();
  }, []);

  const userName = user?.fullName || "there";
  const userEmail = user?.email || "";

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
          active={active}
          onNavClick={setActive}
        />

        <main className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-6">
  <PageRenderer
    active={active}
    dashboardContent={
      <div className="flex w-full flex-col gap-5">
        <section className="rounded-[28px] border border-[var(--color-divider)] bg-[var(--color-db-surface-glass)] px-6 py-5 shadow-[var(--shadow-db-hero)] backdrop-blur-[2px] sm:px-7 sm:py-6">
          <h1 className="font-[var(--font-display)] text-[28px] font-bold tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-[32px]">
            Welcome Back, {userName}.
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-[1.65] text-[var(--color-text-secondary)]">
            {loadingUser
              ? "Loading your workspace details..."
              : userEmail
                ? `Signed in as ${userEmail}. You are all set to collaborate.`
                : "Your workspace details are ready."}
          </p>
        </section>
        <StatsRow />
        <div className="grid gap-5 xl:grid-cols-[1fr_1.35fr_1fr]">
          <QuickActions onStartMeeting={handleStartMeeting} />
          <RecentMessages />
          <ActivityFeed />
        </div>
      </div>
    }
  />
</main>
      </div>
    </div>
  );
}