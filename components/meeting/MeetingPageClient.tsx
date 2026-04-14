"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MeetingRoom from "@/components/meeting/meetingRoom";
import { API_BASE_URL, apiFetch, authApi, type AuthUser } from "@/utils/api";

const MEETING_EVENTS_STORAGE_KEY = "orgChatMeetingEvents";

interface MeetingContext {
  sourceType?: "channel" | "dm";
  sourceId?: number;
  hostUserId?: number;
  startedAt?: string;
  participantCount?: number;
}

interface MeetingTimelineEvent {
  id: string;
  meetingId: string;
  orgId: number;
  type: "started" | "ended";
  timestamp: string;
}

function toInitials(fullName: string) {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return "TS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

interface MeetingPageClientProps {
  meetingId: string;
}

export default function MeetingPageClient({ meetingId }: MeetingPageClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [meetingReady, setMeetingReady] = useState(false);
  const [meetingContext, setMeetingContext] = useState<MeetingContext | null>(null);
  const [joinConfirmed, setJoinConfirmed] = useState(false);

  const saveMeetingEndedEvent = () => {
    if (typeof window === "undefined") return;
    if (!meetingContext || meetingContext.sourceType !== "channel" || !meetingContext.sourceId) return;
    if (!user || meetingContext.hostUserId !== user.userId) return;

    const event: MeetingTimelineEvent = {
      id: `ended:${meetingId}`,
      meetingId,
      orgId: meetingContext.sourceId,
      type: "ended",
      timestamp: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(MEETING_EVENTS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? (parsed as MeetingTimelineEvent[]) : [];
      const deduped = existing.filter((item) => item.id !== event.id);
      deduped.push(event);
      localStorage.setItem(MEETING_EVENTS_STORAGE_KEY, JSON.stringify(deduped));
    } catch {
      // Ignore persistence failures and continue with navigation.
    }
  };

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        setAccessToken(token);

        const cachedUser = localStorage.getItem("userDetails");  
        if (cachedUser) setUser(JSON.parse(cachedUser) as AuthUser);

        const response = await authApi.getMe();
        if (response.data?.user) setUser(response.data.user);
      } catch {
        // keep fallback from cache
      } finally {
        setLoadingUser(false);
      }
    };

    hydrateUser();
  }, []);

  useEffect(() => {
    const validateMeeting = async () => {
      const token = localStorage.getItem("accessToken");

      if (!meetingId) {
        setMeetingError("Missing meeting ID in URL.");
        setMeetingReady(false);
        return;
      }

      if (!token) {
        router.replace(`/auth/login?next=${encodeURIComponent(`/meeting/${meetingId}`)}`);
        return;
      }

      try {
        const response = await apiFetch(`${API_BASE_URL}/meetings/${meetingId}`);
        const data = await response.json();

        if (!response.ok || !data?.success) {
          setMeetingError(data?.message || "Meeting is invalid or unavailable.");
          setMeetingReady(false);
          return;
        }

        if (!data?.data?.isActive) {
          setMeetingError("This meeting has already ended.");
          setMeetingReady(false);
          return;
        }

        setMeetingContext({
          sourceType: data?.data?.sourceType,
          sourceId: data?.data?.sourceId,
          hostUserId: data?.data?.hostUserId,
          startedAt: data?.data?.startedAt,
          participantCount: data?.data?.participantCount,
        });
        setMeetingError(null);
        setMeetingReady(true);
      } catch {
        setMeetingError("Unable to verify meeting right now. Please try again.");
        setMeetingReady(false);
      }
    };

    validateMeeting();
  }, [meetingId, router]);

  const socketUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_SOCKET_URL || "https://192.168.21.35:4000";
    return base.endsWith("/") ? base.slice(0, -1) : base;
  }, []);

  if (loadingUser && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page-mid)] text-[var(--color-text-secondary)]">
        Loading meeting room...
      </div>
    );
  }

  if (meetingError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page-mid)] px-6 text-center text-[var(--color-error)]">
        {meetingError}
      </div>
    );
  }

  if (!meetingReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page-mid)] text-[var(--color-text-secondary)]">
        Validating meeting...
      </div>
    );
  }

  const shouldShowJoinPrompt =
    !!user && !!meetingContext && meetingContext.hostUserId !== user.userId && !joinConfirmed;

  if (shouldShowJoinPrompt) {
    const startedAt = meetingContext?.startedAt ? new Date(meetingContext.startedAt) : null;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page-mid)] px-5 py-8">
        <div className="w-full max-w-[520px] rounded-[24px] border border-[var(--color-divider)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-db-card)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Meeting Invite</p>
          <h1 className="mt-2 text-[24px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">Join Meeting</h1>
          <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
            You are invited to join this {meetingContext?.sourceType === "channel" ? "organization" : "direct"} meeting.
          </p>

          <div className="mt-5 space-y-2 rounded-2xl border border-[var(--color-divider)] bg-[var(--color-landing-input-bg)] p-4 text-[13.5px]">
            <p className="text-[var(--color-text-primary)]"><span className="font-semibold">Meeting ID:</span> {meetingId}</p>
            <p className="text-[var(--color-text-primary)]"><span className="font-semibold">Participants:</span> {meetingContext?.participantCount ?? 0} online</p>
            <p className="text-[var(--color-text-primary)]"><span className="font-semibold">Started:</span> {startedAt ? startedAt.toLocaleString() : "Unknown"}</p>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push("/authenticated/dashboard")}
              className="rounded-xl border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setJoinConfirmed(true)}
              className="rounded-xl border border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-deep)]"
            >
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fallbackName = user?.fullName || "TeamSync User";

  return (
    <MeetingRoom
      meetingId={meetingId}
      accessToken={accessToken}
      socketUrl={socketUrl}
      currentUser={{
        id: user?.userId || -1,
        name: fallbackName,
        initials: toInitials(fallbackName),
        color: "var(--color-brand)",
      }}
      onLeave={() => {
        saveMeetingEndedEvent();
        router.push("/authenticated/dashboard");
      }}
    />
  );
}
