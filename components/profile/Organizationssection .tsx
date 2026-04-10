"use client";

import { Building2, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { UserOrganization } from "@/types/profile";

interface OrganizationsSectionProps {
  organizations: UserOrganization[];
}

export default function OrganizationsSection({ organizations }: OrganizationsSectionProps) {
  return (
    <section
      className="rounded-2xl p-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-divider)",
        boxShadow: "var(--shadow-db-card)",
      }}
    >
      <p className="mb-1 text-[0.68rem] font-bold tracking-widest" style={{ color: "var(--color-brand)" }}>
        MEMBERSHIPS
      </p>
      <h2 className="mb-1 text-[1.05rem] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
        Organizations
      </h2>
      <p className="mb-5 text-[0.8rem]" style={{ color: "var(--color-text-muted)" }}>
        Workspaces you are a member of
      </p>

      {organizations.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl py-10"
          style={{ background: "var(--color-brand-xsubtle)", border: "1px dashed var(--color-brand-light)" }}
        >
          <Building2 size={28} style={{ color: "var(--color-brand-light)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            You are not part of any organization yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {organizations.map((org) => (
            <div
              key={org.orgId}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition"
              style={{
                background: "var(--color-brand-xsubtle)",
                border: "1px solid var(--color-divider)",
              }}
            >
              {/* Org icon */}
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
                  boxShadow: "var(--shadow-db-icon)",
                }}
              >
                <Building2 size={18} color="white" />
              </div>

              {/* Org info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "var(--color-text-primary)" }}>
                  {org.orgName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <CalendarDays size={11} style={{ color: "var(--color-text-muted)" }} />
                  <span className="text-[0.72rem]" style={{ color: "var(--color-text-muted)" }}>
                    Since {new Date(org.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                  </span>
                  <span className="mx-1 text-[0.72rem]" style={{ color: "var(--color-text-muted)" }}>·</span>
                  <span className="text-[0.72rem]" style={{ color: "var(--color-text-muted)" }}>
                    ID #{org.orgId}
                  </span>
                </div>
              </div>

              {/* Active badge — from User.isActive */}
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold flex-shrink-0"
                style={{
                  background: org.isActive ? "rgba(16,185,129,0.1)" : "var(--color-error-bg)",
                  color: org.isActive ? "#059669" : "var(--color-error)",
                }}
              >
                {org.isActive
                  ? <><CheckCircle2 size={11} /> Active</>
                  : <><XCircle size={11} /> Inactive</>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}