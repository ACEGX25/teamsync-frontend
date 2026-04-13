"use client";

import { Loader2, Calendar, Trash2, MessageSquare, Search } from "lucide-react";
import type { Organization } from "@/utils/api";

interface Props {
  orgs: Organization[];
  loading: boolean;
  error: string;
  search: string;
  onSearchChange: (v: string) => void;
  onDelete: (orgId: number) => void;
  onViewChat: (org: Organization) => void;
}

export default function OrgTable({
  orgs,
  loading,
  error,
  search,
  onSearchChange,
  onDelete,
  onViewChat,
}: Props) {
  const filtered = orgs.filter((o) =>
    o.orgName.toLowerCase().includes(search.toLowerCase())
  );

  const avatarColors = [
    { bg: "var(--color-db-stats-members-bg)", text: "var(--color-db-stats-members-icon)" },
    { bg: "var(--color-db-stats-messages-bg)", text: "var(--color-db-stats-messages-icon)" },
    { bg: "var(--color-brand-subtle)", text: "var(--color-brand-deep)" },
    { bg: "var(--color-db-stats-sync-bg)", text: "var(--color-db-stats-sync-icon)" },
  ];

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        border: "1px solid var(--color-divider)",
        background: "var(--color-db-surface-glass)",
        backdropFilter: "blur(2px)",
        boxShadow: "var(--shadow-db-card)",
      }}
    >
      {/* Toolbar — compact search pinned to the right */}
      <div
        className="flex items-center justify-end px-5 py-3"
        style={{ borderBottom: "1px solid var(--color-divider)" }}
      >
        <div className="relative flex items-center">
          <Search
            size={13}
            className="absolute left-3 pointer-events-none"
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-xl py-1.5 pl-8 pr-3 text-[13px] outline-none transition"
            style={{
              width: "220px",
              border: "1px solid var(--color-divider)",
              background: "var(--color-surface-frost)",
              color: "var(--color-text-primary)",
            }}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 text-[11px] px-1.5 py-0.5 rounded transition"
              style={{
                color: "var(--color-text-muted)",
                background: "var(--color-brand-xsubtle)",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[13px]">
          <Loader2 size={16} className="animate-spin" />
        </div>
      ) : (
        <table className="w-full text-[15px]">
          <thead>
            <tr
              style={{
                background: "var(--color-brand-xsubtle)",
                borderBottom: "2px solid var(--color-brand-subtle)",
              }}
            >
              {["Organization", "Members", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`py-5 px-5 font-bold text-[13px] uppercase tracking-widest ${
                    h === "Actions" ? "text-right" : "text-left"
                  }`}
                  style={{ color: "var(--color-brand-deep)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-[13px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No organizations found.
                </td>
              </tr>
            ) : (
              filtered.map((org, i) => {
                const color = avatarColors[i % avatarColors.length];
                return (
                  <tr
                    key={org.id ?? i}
                    className="transition-colors group"
                    style={
                      i !== filtered.length - 1
                        ? { borderBottom: "1px solid var(--color-divider)" }
                        : {}
                    }
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--color-brand-xsubtle)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Org name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{ background: color.bg, color: color.text }}
                        >
                          {org.orgName[0].toUpperCase()}
                        </div>
                        <span
                          className="font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {org.orgName}
                        </span>
                      </div>
                    </td>

                    {/* Member count */}
                    <td
                      className="px-5 py-4"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {org.memberCount ?? "—"}
                    </td>

                    {/* Created date */}
                    <td
                      className="px-5 py-4"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={12}
                          style={{ color: "var(--color-text-muted)" }}
                        />
                        {org.createdAt
                          ? new Date(org.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewChat(org)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
                          style={{
                            background: "var(--color-brand-subtle)",
                            color: "var(--color-brand-deep)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          <MessageSquare size={13} />
                          View
                        </button>

                        <button
                          onClick={() => onDelete(org.orgId)}
                          className="p-1.5 rounded-lg transition"
                          style={{ color: "var(--color-text-muted)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--color-error-bg)";
                            e.currentTarget.style.color = "var(--color-error)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--color-text-muted)";
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}