"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, Loader2, Shield, Mail } from "lucide-react";
import { orgApi, type OrgMember } from "@/utils/api";

interface Props {
  orgId: number;
  orgName: string;
  onClose: () => void;
}

export default function OrgMembersPanel({ orgId, orgName, onClose }: Props) {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await orgApi.getMembers(orgId);
      setMembers(res);
    } catch {
      setError("Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [orgId]);

  const handleInvite = async () => {
    if (!inviteUserId.trim()) {
      setInviteError("User ID is required.");
      return;
    }
    try {
      setInviting(true);
      setInviteError("");
      setInviteSuccess("");
      await orgApi.addMember(orgId, inviteUserId.trim());
      setInviteUserId("");
      setInviteSuccess("Member added successfully!");
      await fetchMembers();
    } catch (err: any) {
      setInviteError(err?.message || "Failed to add member.");
    } finally {
      setInviting(false);
    }
  };

  const avatarGradients = [
    { start: "var(--color-db-avatar-gradient-start)", end: "var(--color-db-avatar-gradient-end)" },
    { start: "var(--color-db-avatar-green-start)", end: "var(--color-db-avatar-green-end)" },
    { start: "var(--color-db-avatar-blue-start)", end: "var(--color-db-avatar-blue-end)" },
    { start: "var(--color-db-avatar-amber-start)", end: "var(--color-db-avatar-amber-end)" },
    { start: "var(--color-db-avatar-red-start)", end: "var(--color-db-avatar-red-end)" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[var(--color-overlay-dark)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--color-surface-frost-90)] border-l border-l-[var(--color-divider)] shadow-[var(--shadow-card)]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-b-[var(--color-divider)]"
        >
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.03em] font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
              Members
            </h2>
            <p className="text-[12.5px] mt-0.5 text-[var(--color-text-secondary)]">
              {orgName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-subtle)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Invite section */}
        <div className="px-6 py-4 border-b border-[var(--color-divider)]">
          <p
            className="text-[11px] font-medium uppercase tracking-wider mb-2 text-[var(--color-text-muted)]"
          >
            Invite by User ID
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter user ID..."
              value={inviteUserId}
              onChange={(e) => { setInviteUserId(e.target.value); setInviteError(""); setInviteSuccess(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="flex-1 rounded-xl px-3.5 py-2 text-[13px] outline-none transition border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:shadow-[var(--shadow-focus)]"
            />
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition disabled:opacity-60 bg-[image:linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-shell-cta)]"
            >
              {inviting
                ? <Loader2 size={13} className="animate-spin" />
                : <UserPlus size={13} />}
              {inviting ? "Adding..." : "Add"}
            </button>
          </div>
          {inviteError && (
            <p className="text-[12px] mt-1.5 text-[var(--color-error)]">{inviteError}</p>
          )}
          {inviteSuccess && (
            <p className="text-[12px] mt-1.5 text-[var(--color-db-strength-strong)]">{inviteSuccess}</p>
          )}
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider mb-3 text-[var(--color-text-muted)]">
            {loading ? "Loading..." : `${members.length} member${members.length !== 1 ? "s" : ""}`}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-[var(--color-brand)]" />
            </div>
          ) : error ? (
            <p className="text-[13px] text-center py-8 text-[var(--color-error)]">{error}</p>
          ) : members.length === 0 ? (
            <p className="text-[13px] text-center py-8 text-[var(--color-text-muted)]">
              No members yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {members.map((member, i) => {
                const grad = avatarGradients[i % avatarGradients.length];
                const initials = member.login.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 transition border border-[var(--color-divider)] bg-[var(--color-db-surface-glass)] hover:bg-[var(--color-brand-xsubtle)]"
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${grad.start}, ${grad.end})`,
                        boxShadow: "var(--shadow-db-icon)",
                      }}
                    >
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13.5px] font-semibold truncate text-[var(--color-text-primary)]">
                          {member.login.fullName}
                        </p>
                        {member.login.isVerified && (
                          <Shield size={11} className="text-[var(--color-brand)] shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail size={10} className="text-[var(--color-text-muted)]" />
                        <p className="text-[12px] truncate text-[var(--color-text-secondary)]">
                          {member.login.email}
                        </p>
                      </div>
                    </div>

                    {/* Active badge */}
                    <div
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium"
                      style={{
                        background: member.isActive ? "var(--color-db-stats-messages-bg)" : "var(--color-brand-xsubtle)",
                        color: member.isActive ? "var(--color-db-stats-messages-icon)" : "var(--color-text-muted)",
                      }}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}