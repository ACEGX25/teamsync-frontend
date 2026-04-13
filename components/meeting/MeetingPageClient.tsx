"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MeetingRoom from "@/components/meeting/meetingRoom";
import { API_BASE_URL, apiFetch, authApi, type AuthUser } from "@/utils/api";

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
      onLeave={() => router.push("/authenticated/dashboard")}
    />
  );
}
