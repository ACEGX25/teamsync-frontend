"use client";

import { BadgeCheck } from "lucide-react";
import { LoginProfile } from "@/types/profile";

interface ProfileHeroProps {
  login: LoginProfile;
  onSave: () => void;
  saving: boolean;
}

export default function ProfileHero({ login, onSave, saving }: ProfileHeroProps) {
  const initial = login.fullName?.charAt(0).toUpperCase() ?? "?";

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      {/* Banner */}
      <div
        style={{
          height: 130,
          background:
            "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 25%, #ddd6fe 50%, #fbcfe8 75%, #bfdbfe 100%)",
        }}
      />

      {/* Content row */}
      <div className="flex flex-wrap items-end gap-5 px-8 pb-5">
        {/* Avatar — shows initials since no avatar in schema */}
        <div
          className="relative flex items-center justify-center rounded-2xl text-2xl font-bold text-white"
          style={{
            width: 88,
            height: 88,
            marginTop: -44,
            background: "var(--color-db-avatar-gradient)",
            border: "3px solid var(--color-surface)",
            boxShadow: "var(--shadow-shell-avatar)",
            fontFamily: "var(--font-display)",
            flexShrink: 0,
          }}
        >
          {initial}
        </div>

        {/* Name + email + verified */}
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
            >
              {login.fullName}
            </h1>
            {login.isVerified && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold"
                style={{
                  background: "var(--color-brand-subtle)",
                  color: "var(--color-brand)",
                }}
              >
                <BadgeCheck size={12} /> Verified
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {login.email}
          </p>
          <p className="mt-0.5 text-[0.72rem]" style={{ color: "var(--color-text-muted)" }}>
            Member since {new Date(login.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={saving}
          className="mb-1 whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
            boxShadow: "var(--shadow-btn)",
            fontFamily: "var(--font-base)",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}