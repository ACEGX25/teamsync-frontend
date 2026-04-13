"use client";

import { FileText, Image as ImageIcon } from "lucide-react";
import type { ChatMessage } from "./OrgChatPage";

interface Props {
  messages: ChatMessage[];
  currentUserId: string;
}

const AVATAR_GRADIENTS = [
  ["#6e49b6", "#4a2d8c"],
  ["#2563eb", "#1d4ed8"],
  ["#059669", "#047857"],
  ["#d97706", "#b45309"],
  ["#dc2626", "#b91c1c"],
  ["#7c3aed", "#6d28d9"],
];

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDayLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getGradient(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  const [start, end] = AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${start}, ${end})`;
}

export default function OrgChatMessages({ messages, currentUserId }: Props) {
  // Group messages by day
  const groups: { label: string; messages: ChatMessage[] }[] = [];
  let currentLabel = "";

  for (const msg of messages) {
    const label = formatDayLabel(msg.timestamp);
    if (label !== currentLabel) {
      groups.push({ label, messages: [msg] });
      currentLabel = label;
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-8 py-6 space-y-8"
      style={{ background: "var(--color-surface, #faf8ff)" }}
    >
      {groups.map((group) => (
        <div key={group.label}>
          {/* Day divider */}
          <div className="flex items-center gap-4 py-4">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-divider, #e0e2f0)" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.1em] uppercase"
              style={{ color: "var(--color-text-muted, #777a87)" }}
            >
              {group.label}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-divider, #e0e2f0)" }}
            />
          </div>

          <div className="space-y-6">
            {group.messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5"
                    style={{ background: getGradient(msg.senderName) }}
                  >
                    {msg.senderInitials}
                  </div>

                  <div className={`flex-1 max-w-2xl ${isMe ? "flex flex-col items-end" : ""}`}>
                    {/* Name + time */}
                    <div
                      className={`flex items-baseline gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className="font-bold text-[13.5px]"
                        style={{ color: "var(--color-text-primary, #2f323d)" }}
                      >
                        {isMe ? "You" : msg.senderName}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--color-text-muted, #777a87)" }}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    {/* Bubble */}
                    {msg.content && (
                      <div
                        className="px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed"
                        style={
                          isMe
                            ? {
                                background:
                                  "linear-gradient(135deg, var(--color-brand, #6e49b6), var(--color-brand-deep, #4a2d8c))",
                                color: "#fff",
                                borderRadius: "18px 18px 4px 18px",
                              }
                            : {
                                background: "var(--color-surface-container-lowest, #fff)",
                                color: "var(--color-text-primary, #2f323d)",
                                border: "1px solid var(--color-divider, #e0e2f0)",
                                borderRadius: "4px 18px 18px 18px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                              }
                        }
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* File attachments */}
                    {msg.files && msg.files.length > 0 && (
                      <div className={`mt-2 flex flex-wrap gap-2 ${isMe ? "justify-end" : ""}`}>
                        {msg.files.map((file, fi) => (
                          <a
                            key={fi}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-medium transition hover:opacity-80"
                            style={{
                              background: "var(--color-brand-subtle, #ede9f8)",
                              color: "var(--color-brand, #6e49b6)",
                              border: "1px solid var(--color-brand-subtle, #ede9f8)",
                              maxWidth: "220px",
                            }}
                          >
                            {file.type.startsWith("image/") ? (
                              <ImageIcon size={13} className="shrink-0" />
                            ) : (
                              <FileText size={13} className="shrink-0" />
                            )}
                            <span className="truncate">{file.name}</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`flex gap-1.5 mt-2 ${isMe ? "justify-end" : ""}`}>
                        {msg.reactions.map((r, ri) => (
                          <div
                            key={ri}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: "var(--color-secondary-container, #e9def8)",
                              color: "var(--color-on-secondary-container, #564e63)",
                            }}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}