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
import {
  authApi,
  meetingApi,
  orgApi,
  type AuthUser,
  type Organization,
} from "@/utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [startingMeeting, setStartingMeeting] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingMode, setMeetingMode] = useState<"personal" | "organization">("personal");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);

  const getOrganizationId = (org: Organization): number => org.id ?? org.orgId;

  const openMeetingModal = async () => {
    setShowMeetingModal(true);
    setMeetingMode("personal");
    setSelectedOrganizationId("");

    try {
      setLoadingOrganizations(true);
      const orgs = await orgApi.getMyOrganizations();
      const mapped = (Array.isArray(orgs) ? orgs : []).map((org) => ({
        ...org,
        id: getOrganizationId(org),
      }));
      setOrganizations(mapped);
      if (mapped.length > 0) {
        setSelectedOrganizationId(String(getOrganizationId(mapped[0])));
      }
    } catch {
      setOrganizations([]);
      setSelectedOrganizationId("");
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const handleStartMeeting = async () => {
    if (startingMeeting) return;
    if (!user) {
      alert("User details not loaded yet. Please try again.");
      return;
    }

    const sourceType = meetingMode === "personal" ? "dm" : "channel";
    const sourceId =
      meetingMode === "personal"
        ? user.userId
        : Number(selectedOrganizationId);

    if (!sourceId) {
      alert("Please select an organization first.");
      return;
    }

    try {
      setStartingMeeting(true);

      const meeting = await meetingApi.createMeeting(sourceType, sourceId);
      setShowMeetingModal(false);
      router.push(`/meeting/${meeting.meetingId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start meeting";
      alert(message);
    } finally {
      setStartingMeeting(false);
    }
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
          onNavClick={(id) => {
            if (id === "messages") {
              router.push("/authenticated/chat");
            } else {
              setActive(id);
            }
          }}
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

      {showMeetingModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-[460px] rounded-3xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-db-hero)]">
            <h3 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
              Start a meeting
            </h3>

            <p className="mt-3 text-sm font-semibold text-[var(--color-text-secondary)]">Start as:</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMeetingMode("personal")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${meetingMode === "personal"
                    ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                    : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
                  }`}
              >
                Personal Meeting
              </button>

              <button
                type="button"
                onClick={() => setMeetingMode("organization")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${meetingMode === "organization"
                    ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                    : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
                  }`}
              >
                Select an Organization
              </button>
            </div>

            {meetingMode === "organization" && (
              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  Organization
                </label>
                <select
                  value={selectedOrganizationId}
                  onChange={(e) => setSelectedOrganizationId(e.target.value)}
                  disabled={loadingOrganizations || organizations.length === 0}
                  className="w-full rounded-xl border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none"
                >
                  {organizations.length === 0 ? (
                    <option value="">{loadingOrganizations ? "Loading organizations..." : "No organizations found"}</option>
                  ) : (
                    organizations.map((organization) => (
                      <option key={getOrganizationId(organization)} value={getOrganizationId(organization)}>
                        {organization.orgName}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="rounded-xl border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartMeeting}
                disabled={startingMeeting || (meetingMode === "organization" && !selectedOrganizationId)}
                className="rounded-xl border border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startingMeeting ? "Starting..." : "Start Meeting"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}