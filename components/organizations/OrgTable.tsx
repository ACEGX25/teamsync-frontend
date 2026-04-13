"use client";

import { useState } from "react";
import { Search, Loader2, Calendar, Trash2, Users } from "lucide-react"; // Added Trash2 and Users
import type { Organization } from "@/utils/api";
import OrgMembersPanel from "./OrgMembersPanel";

interface Props {
  orgs: Organization[];
  loading: boolean;
  error: string;
  search: string;
  onSearchChange: (v: string) => void;
  onDelete: (orgId: number) => void;
}

export default function OrgTable({ orgs, loading, error, search, onSearchChange, onDelete }: Props) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

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
    <div>
      {/* Search Input remains the same... */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl py-2.5 pl-9 pr-4 text-[13.5px] outline-none transition"
          style={{ border: "1px solid var(--color-divider)", background: "var(--color-surface-frost)", color: "var(--color-text-primary)" }}
        />
      </div>

      <div
        className="rounded-[20px] overflow-hidden"
        style={{ border: "1px solid var(--color-divider)", background: "var(--color-db-surface-glass)", backdropFilter: "blur(2px)", boxShadow: "var(--shadow-db-card)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[13px]"><Loader2 size={16} className="animate-spin" /></div>
        ) : (
          <table className="w-full text-[13.5px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-divider)" }}>
                {["Organization", "Members", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`py-3 px-5 font-medium text-[11px] uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((org, i) => {
                const color = avatarColors[i % avatarColors.length];
                return (
                  <tr
                    key={org.id ?? i}
                    className="transition-colors group"
                    style={i !== filtered.length - 1 ? { borderBottom: "1px solid var(--color-divider)" } : {}}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-xsubtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: color.bg, color: color.text }}>
                          {org.orgName[0].toUpperCase()}
                        </div>
                        <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{org.orgName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>{org.memberCount ?? "—"}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-text-secondary)" }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} style={{ color: "var(--color-text-muted)" }} />
                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </div>
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Members Button */}
                        <button
                          onClick={() => setSelectedOrg(org)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition"
                          style={{ background: "var(--color-brand-subtle)", color: "var(--color-brand-deep)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          <Users size={14} />
                          View
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => {
    console.log("Deleting Org with ID:", org.orgId); // Debug: Check if this is undefined
    onDelete(org.orgId); // Ensure this matches your schema property 'orgId'
  }}
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
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrg && (
        <OrgMembersPanel
          orgId={selectedOrg.id}
          orgName={selectedOrg.orgName}
          onClose={() => setSelectedOrg(null)}
        />
      )}
    </div>
  );
}
