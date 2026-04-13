"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MeetingRoom from "@/components/meeting/meetingRoom";
import { authApi, type AuthUser } from "@/utils/api";

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

  useEffect(() => {
    const hydrateUser = async () => {
      try {
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

  const wsUrl = useMemo(() => {
    const wsBase = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/meetings";
    const normalizedBase = wsBase.endsWith("/") ? wsBase.slice(0, -1) : wsBase;
    return `${normalizedBase}/${meetingId}`;
  }, [meetingId]);

  if (loadingUser && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page-mid)] text-[var(--color-text-secondary)]">
        Loading meeting room...
      </div>
    );
  }

  const fallbackName = user?.fullName || "TeamSync User";

  return (
    <MeetingRoom
      meetingId={meetingId}
      wsUrl={wsUrl}
      currentUser={{
        id: String(user?.userId || "guest-user"),
        name: fallbackName,
        initials: toInitials(fallbackName),
        color: "var(--color-brand)",
      }}
      onLeave={() => router.push("/authenticated/dashboard")}
    />
  );
}
