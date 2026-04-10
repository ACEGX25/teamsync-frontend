"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { ChangePasswordPayload } from "@/types/profile";
import { changePassword } from "@/utils/profileApi";

export default function ChangePasswordSection() {
  const [form, setForm] = useState<ChangePasswordPayload>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showFields, setShowFields] = useState({ current: false, newP: false, confirm: false });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof ChangePasswordPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatus("idle");
    setErrorMsg("");
  };

  // Password strength — based on Login.password requirements
  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(form.newPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "var(--color-db-strength-weak)", "var(--color-warn)", "var(--color-db-strength-medium)", "var(--color-db-strength-strong)"][strength];

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setErrorMsg("All fields are required.");
      setStatus("error");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      setStatus("error");
      return;
    }
    if (strength < 2) {
      setErrorMsg("Password is too weak. Use at least 8 characters with uppercase and numbers.");
      setStatus("error");
      return;
    }
    try {
      setStatus("loading");
      await changePassword(form);
      setStatus("success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to change password.");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.55rem 2.5rem 0.55rem 0.75rem",
    border: "1px solid var(--color-input-border)",
    borderRadius: "var(--radius-input)",
    fontSize: "0.875rem",
    fontFamily: "var(--font-base)",
    color: "var(--color-text-primary)",
    background: "var(--color-input-bg)",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const fields: { key: keyof ChangePasswordPayload; label: string; show: boolean; toggleKey: keyof typeof showFields }[] = [
    { key: "currentPassword", label: "Current Password", show: showFields.current, toggleKey: "current" },
    { key: "newPassword", label: "New Password", show: showFields.newP, toggleKey: "newP" },
    { key: "confirmPassword", label: "Confirm New Password", show: showFields.confirm, toggleKey: "confirm" },
  ];

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
        SECURITY
      </p>
      <h2 className="mb-1 text-[1.05rem] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
        Change Password
      </h2>
      <p className="mb-5 text-[0.8rem]" style={{ color: "var(--color-text-muted)" }}>
        Update your Login password. You will stay signed in after changing.
      </p>

      <div className="flex flex-col gap-4">
        {fields.map(({ key, label, show, toggleKey }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              {label}
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-brand)"; e.target.style.boxShadow = "var(--shadow-focus)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-input-border)"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowFields((prev) => ({ ...prev, [toggleKey]: !prev[toggleKey] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-muted)", background: "none", border: "none", cursor: "pointer" }}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Strength bar — only for new password */}
            {key === "newPassword" && form.newPassword && (
              <div className="mt-1">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{
                        background: i <= strength ? strengthColor : "var(--color-db-strength-track)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[0.72rem] font-semibold" style={{ color: strengthColor }}>
                  {strengthLabel}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Error / success feedback */}
        {status === "error" && (
          <div
            className="rounded-xl px-3 py-2.5 text-sm font-medium"
            style={{ background: "var(--color-error-bg)", color: "var(--color-error)", border: "1px solid var(--color-error-border)" }}
          >
            {errorMsg}
          </div>
        )}
        {status === "success" && (
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
            style={{ background: "rgba(16,185,129,0.08)", color: "#059669", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <ShieldCheck size={15} /> Password updated successfully.
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 self-start rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
            boxShadow: "var(--shadow-btn)",
            fontFamily: "var(--font-base)",
          }}
        >
          <Lock size={14} />
          {status === "loading" ? "Updating…" : "Update Password"}
        </button>
      </div>
    </section>
  );
}