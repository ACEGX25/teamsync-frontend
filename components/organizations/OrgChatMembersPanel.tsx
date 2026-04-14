"use client";

import { Loader2 } from "lucide-react";
import type { OrgMember } from "@/utils/api";

interface Props {
  members: OrgMember[];
  loading: boolean;
}

const AVATAR_GRADIENTS = [
  ["#6e49b6", "#4a2d8c"],
  ["#2563eb", "#1d4ed8"],
  ["#059669", "#047857"],
  ["#d97706", "#b45309"],
  ["#dc2626", "#b91c1c"],
  ["#7c3aed", "#6d28d9"],
];

function getGradient(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  const [start, end] = AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${start}, ${end})`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// For demo: treat members with even index as "online", odd as "offline"
// Replace this logic with real presence data when available
function splitMembers(members: OrgMember[]) {
  const online: OrgMember[] = [];
  const offline: OrgMember[] = [];
  members.forEach((m, i) => {
    if (m.isActive) online.push(m);
    else offline.push(m);
  });
  return { online, offline };
}

export default function OrgChatMembersPanel({ members, loading }: Props) {
  const { online, offline } = splitMembers(members);

  return (
    <aside
      className="w-72 shrink-0 flex flex-col overflow-y-auto min-h-0"
      style={{
        background: "var(--color-surface-container-high, #e6e7f4)",
        borderLeft: "1px solid var(--color-divider, #e0e2f0)",
      }}
    >
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2
              size={18}
              className="animate-spin"
              style={{ color: "var(--color-brand, #6e49b6)" }}
            />
          </div>
        ) : (
          <>
            {/* Online */}
            <section>
              <h3
                className="text-[10px] font-bold tracking-[0.12em] uppercase mb-4"
                style={{ color: "var(--color-text-muted, #777a87)" }}
              >
                Online — {online.length}
              </h3>
              <div className="space-y-3">
                {online.length === 0 ? (
                  <p
                    className="text-[12px]"
                    style={{ color: "var(--color-text-muted, #777a87)" }}
                  >
                    No members online
                  </p>
                ) : (
                  online.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      status="online"
                    />
                  ))
                )}
              </div>
            </section>

            {/* Offline */}
            {offline.length > 0 && (
              <section>
                <h3
                  className="text-[10px] font-bold tracking-[0.12em] uppercase mb-4"
                  style={{ color: "var(--color-text-muted, #777a87)" }}
                >
                  Offline — {offline.length}
                </h3>
                <div className="space-y-3 opacity-50 grayscale">
                  {offline.map((m) => (
                    <MemberRow key={m.id} member={m} status="offline" />
                  ))}
                </div>
              </section>
            )}

            {members.length === 0 && (
              <p
                className="text-[12.5px] text-center py-8"
                style={{ color: "var(--color-text-muted, #777a87)" }}
              >
                No members in this organization yet.
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

function MemberRow({
  member,
  status,
}: {
  member: OrgMember;
  status: "online" | "offline";
}) {
  const name = member.login?.fullName ?? "Unknown";
  const statusText = member.login?.email ?? "";
  const initials = getInitials(name);

  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="relative shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white"
          style={{ background: getGradient(name) }}
        >
          {initials}
        </div>
        {/* Status dot */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
          style={{
            background:
              status === "online"
                ? "#10b981"
                : "var(--color-text-muted, #777a87)",
            borderColor:
              "var(--color-surface-container-high, #e6e7f4)",
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-[13px] leading-tight truncate"
          style={{ color: "var(--color-text-primary, #2f323d)" }}
        >
          {name}
        </p>
        {statusText && (
          <p
            className="text-[11px] truncate mt-0.5"
            style={{ color: "var(--color-text-muted, #777a87)" }}
          >
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
}