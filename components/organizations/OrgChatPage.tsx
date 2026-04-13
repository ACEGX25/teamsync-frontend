"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, UserPlus, X, Loader2 } from "lucide-react";
import OrgChatMessages from "./OrgChatMessages";
import OrgChatInput from "./OrgChatInput";
import OrgChatMembersPanel from "./OrgChatMembersPanel";
import { orgApi, type OrgMember } from "@/utils/api";

interface Props {
  orgId: number;
  orgName: string;
  onBack: () => void;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: Date;
  files?: { name: string; url: string; type: string }[];
  reactions?: { emoji: string; count: number }[];
}

const CURRENT_USER = { id: "me", name: "You", initials: "ME" };

export default function OrgChatPage({ orgId, orgName, onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState(0);

  // Measure where this component actually starts in the viewport
  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTopOffset(Math.round(rect.top));
    }
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "alex",
      senderName: "Alex Mercer",
      senderInitials: "AM",
      content: `Welcome to the ${orgName} organization chat! Use this space to collaborate with your team.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      reactions: [{ emoji: "👋", count: 3 }],
    },
  ]);

  const [members, setMembers] = useState<OrgMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const res = await orgApi.getMembers(orgId);
      setMembers(res);
    } catch {
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [orgId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;
    const attachments = files?.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type,
    }));
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: CURRENT_USER.id,
        senderName: CURRENT_USER.name,
        senderInitials: CURRENT_USER.initials,
        content,
        timestamp: new Date(),
        files: attachments,
      },
    ]);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError("Please enter an email or user ID.");
      return;
    }
    try {
      setInviting(true);
      setInviteError("");
      setInviteSuccess("");
      await orgApi.addMember(orgId, inviteEmail.trim());
      setInviteSuccess("Member added successfully!");
      setInviteEmail("");
      await fetchMembers();
    } catch (err: any) {
      setInviteError(err?.message || "Failed to add member. Check the email/ID and try again.");
    } finally {
      setInviting(false);
    }
  };

  return (
    // Sentinel div — zero height, just used to measure top offset
    <div ref={containerRef} className="w-full">
      {topOffset > 0 && (
        <div
          className="fixed left-0 right-0 flex overflow-hidden"
          style={{
            top: topOffset,
            bottom: 0,
            zIndex: 10,
            background: "var(--color-background, #faf8ff)",
          }}
        >
          {/* ── Main chat area ── */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

            {/* Header */}
            <header
              className="flex items-center gap-3 px-6 h-16 shrink-0"
              style={{
                borderBottom: "1px solid var(--color-divider, #e0e2f0)",
                background: "var(--color-surface, #faf8ff)",
              }}
            >
              {/* Back */}
              <button
                onClick={onBack}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors shrink-0"
                style={{ color: "var(--color-text-secondary, #635b71)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-xsubtle, #ede9f8)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title="Back to organizations"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Org avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--color-brand, #6e49b6), var(--color-brand-deep, #4a2d8c))",
                }}
              >
                {orgName[0]?.toUpperCase()}
              </div>

              {/* Org name */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span className="text-[14px] font-medium" style={{ color: "var(--color-text-muted, #777a87)" }}>#</span>
                <span
                  className="text-[17px] font-bold tracking-tight truncate"
                  style={{ color: "var(--color-text-primary, #2f323d)" }}
                >
                  {orgName}
                </span>
                <span
                  className="ml-2 text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "var(--color-brand-subtle, #ede9f8)",
                    color: "var(--color-brand, #6e49b6)",
                  }}
                >
                  {membersLoading ? "…" : `${members.length} members`}
                </span>
              </div>

              {/* ── Add Members button ── */}
              <button
                onClick={() => {
                  setShowAddMember(true);
                  setInviteError("");
                  setInviteSuccess("");
                  setInviteEmail("");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all active:scale-95 shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--color-brand, #6e49b6), var(--color-brand-deep, #4a2d8c))",
                  boxShadow: "0 4px 12px rgba(110,73,182,0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <UserPlus size={15} />
                Add Members
              </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <OrgChatMessages messages={messages} currentUserId={CURRENT_USER.id} />
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <OrgChatInput orgName={orgName} onSend={handleSend} />
          </div>

          {/* ── Right sidebar ── */}
          <OrgChatMembersPanel members={members} loading={membersLoading} />

          {/* ── Add Members Modal ── */}
          {showAddMember && (
            <>
              {/* Backdrop */}
              <div
                className="absolute inset-0 z-20"
                style={{ background: "rgba(47,50,61,0.35)", backdropFilter: "blur(4px)" }}
                onClick={() => setShowAddMember(false)}
              />

              {/* Modal */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-md rounded-[24px] p-7"
                style={{
                  background: "var(--color-surface, #faf8ff)",
                  border: "1px solid var(--color-divider, #e0e2f0)",
                  boxShadow: "0 24px 64px rgba(47,50,61,0.18)",
                }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2
                      className="text-[18px] font-bold tracking-tight"
                      style={{ color: "var(--color-text-primary, #2f323d)" }}
                    >
                      Add Members
                    </h2>
                    <p className="text-[12.5px] mt-0.5" style={{ color: "var(--color-text-muted, #777a87)" }}>
                      Invite someone to <span className="font-semibold">#{orgName}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                    style={{ color: "var(--color-text-secondary, #635b71)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-xsubtle, #ede9f8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Input */}
                <label
                  className="block text-[12px] font-medium uppercase tracking-wider mb-2"
                  style={{ color: "var(--color-text-muted, #777a87)" }}
                >
                  Email address or User ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. john@example.com or user ID"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError("");
                    setInviteSuccess("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-[13.5px] outline-none transition"
                  style={{
                    border: "1px solid var(--color-divider, #e0e2f0)",
                    background: "var(--color-surface-container-low, #f3f3fd)",
                    color: "var(--color-text-primary, #2f323d)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(110,73,182,0.15)")
                  }
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />

                {inviteError && (
                  <p className="text-[12.5px] mt-2" style={{ color: "var(--color-error, #a8364b)" }}>
                    {inviteError}
                  </p>
                )}
                {inviteSuccess && (
                  <p className="text-[12.5px] mt-2" style={{ color: "#059669" }}>
                    ✓ {inviteSuccess}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 rounded-xl py-2.5 text-[13.5px] font-medium transition"
                    style={{
                      border: "1px solid var(--color-divider, #e0e2f0)",
                      color: "var(--color-text-secondary, #635b71)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-xsubtle, #ede9f8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={inviting}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold text-white transition disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, var(--color-brand, #6e49b6), var(--color-brand-deep, #4a2d8c))",
                      boxShadow: inviting ? "none" : "0 4px 12px rgba(110,73,182,0.25)",
                    }}
                  >
                    {inviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    {inviting ? "Adding..." : "Add Member"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}