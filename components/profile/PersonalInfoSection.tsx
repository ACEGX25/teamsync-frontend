"use client";

import { LoginProfile } from "@/types/profile";

interface PersonalInfoSectionProps {
  login: LoginProfile;
  onChange: (field: keyof Pick<LoginProfile, "fullName" | "email">, value: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  border: "1px solid var(--color-input-border)",
  borderRadius: "var(--radius-input)",
  fontSize: "0.875rem",
  fontFamily: "var(--font-base)",
  color: "var(--color-text-primary)",
  background: "var(--color-input-bg)",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

export default function PersonalInfoSection({ login, onChange }: PersonalInfoSectionProps) {
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
        IDENTITY
      </p>
      <h2 className="mb-5 text-[1.05rem] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
        Personal Information
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* fullName — from Login.fullName */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.8rem] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Full Name
          </label>
          <input
            type="text"
            value={login.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand)"; e.target.style.boxShadow = "var(--shadow-focus)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-input-border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* email — from Login.email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.8rem] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Email Address
          </label>
          <input
            type="email"
            value={login.email}
            onChange={(e) => onChange("email", e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand)"; e.target.style.boxShadow = "var(--shadow-focus)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-input-border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* userId — read-only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.8rem] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            User ID
          </label>
          <input
            type="text"
            value={`#${login.userId}`}
            readOnly
            style={{ ...inputStyle, background: "var(--color-brand-xsubtle)", cursor: "not-allowed", color: "var(--color-text-muted)" }}
          />
        </div>

        {/* isVerified — read-only status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.8rem] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Account Status
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              border: "1px solid var(--color-input-border)",
              background: login.isVerified ? "var(--color-brand-xsubtle)" : "var(--color-error-bg)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-base)",
            }}
          >
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ background: login.isVerified ? "var(--color-brand)" : "var(--color-error)" }}
            />
            <span style={{ color: login.isVerified ? "var(--color-brand)" : "var(--color-error)", fontWeight: 600 }}>
              {login.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}