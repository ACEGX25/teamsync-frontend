"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, Check, X } from "lucide-react";
import { registrationApi } from "@/utils/auth/registrationApi";
import Footer from "@/shared/Footer";
import {
  getPasswordChecks,
  getPasswordStrength,
  sanitizeNameInput,
} from "@/utils/validation/LoginValidation";

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  email: string;
  onNext?: () => void;
}

export default function StepSecure({ email, onNext }: Props) {
  const [fullName, setFullName] = useState("");
  const [pw, setPw] = useState("");
  const [cf, setCf] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(pw);
  const passwordChecks = getPasswordChecks(pw);
  const strengthTextClass =
    strength.level >= 3
      ? "text-[var(--color-db-strength-strong)]"
      : strength.level === 2
        ? "text-[var(--color-db-strength-medium)]"
        : strength.level === 1
          ? "text-[var(--color-db-strength-weak)]"
          : "text-[var(--color-text-muted)]";
  const strengthFillClass =
    strength.level >= 3
      ? "bg-[var(--color-db-strength-strong)]"
      : strength.level === 2
        ? "bg-[var(--color-db-strength-medium)]"
        : strength.level === 1
          ? "bg-[var(--color-db-strength-weak)]"
          : "bg-transparent";
  const strengthWidthClass =
    strength.level === 4
      ? "w-full"
      : strength.level === 3
        ? "w-3/4"
        : strength.level === 2
          ? "w-1/2"
          : strength.level === 1
            ? "w-1/4"
            : "w-0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cf) { setError("Passwords do not match."); return; }
    if (strength.level < 2) { setError("Please choose a stronger password."); return; }
    setError("");
    setLoading(true);
    try {
      await registrationApi.completeRegister(email, fullName, pw);
      onNext?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_60%_10%,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-auth-page-mid)_60%,var(--color-bg-page-end)_100%)] px-6 py-6 font-[var(--font-base)]">
      <div className="flex w-full max-w-[420px] flex-col items-start rounded-[var(--radius-page)] bg-[var(--color-surface)] px-11 pb-10 pt-12 shadow-[var(--shadow-card)]">

        {/* Shield */}
        <div className="mb-6 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[var(--radius-shield)] bg-[linear-gradient(145deg,var(--color-brand-xsubtle),var(--color-brand-subtle))] shadow-[var(--shadow-shield)]">
          <ShieldCheck size={24} fill="var(--color-brand)" color="var(--color-surface)" aria-hidden="true" />
        </div>

        <h1 className="text-[26px] font-bold tracking-[-0.5px] text-[var(--color-text-primary)]">Secure Your Account</h1>
        <p className="mb-8 mt-2 text-[14.5px] leading-[1.55] text-[var(--color-text-secondary)]">
          One last step — set your name<br />and a strong password.
        </p>

        <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>

          {/* Full name */}
          <div className="flex w-full flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.9px] text-[var(--color-text-muted)]">Your Name</label>
            <input
              type="text"
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-3.5 text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => { setFullName(sanitizeNameInput(e.target.value)); setError(""); }}
              required
              autoComplete="name"
            />
          </div>

          {/* New password */}
          <div className="flex w-full flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.9px] text-[var(--color-text-muted)]">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                className="w-full rounded-[var(--radius-input)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] py-3.5 pl-4 pr-11 text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
                placeholder="Enter Password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="absolute right-3.5 p-1 text-[var(--color-text-faint)] hover:text-[var(--color-brand)]" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>

            {/* Strength meter */}
            {pw && (
              <>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.8px] ${strengthTextClass}`}>
                    Strength: {strength.label}
                  </span>
                  <div className="flex gap-[5px]">
                    {[1, 2, 3, 4].map((d) => (
                      <span
                        key={d}
                        className={`h-2 w-2 rounded-full ${d <= strength.level ? strengthFillClass : "bg-[var(--color-input-border)]"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-db-strength-track)]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthWidthClass} ${strengthFillClass}`}
                  />
                </div>
              </>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex w-full flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.9px] text-[var(--color-text-muted)]">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showCf ? "text" : "password"}
                className="w-full rounded-[var(--radius-input)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] py-3.5 pl-4 pr-11 text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
                placeholder="Retype Password"
                value={cf}
                onChange={(e) => { setCf(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="absolute right-3.5 p-1 text-[var(--color-text-faint)] hover:text-[var(--color-brand)]" onClick={() => setShowCf(!showCf)} tabIndex={-1}>
                {showCf ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="flex w-full items-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--color-error)]">
              <AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] px-6 py-[17px] text-[15.5px] font-bold text-[var(--color-surface)] shadow-[var(--shadow-btn)] transition-all duration-200 hover:-translate-y-px hover:opacity-95 hover:shadow-[var(--shadow-btn-hover)] disabled:cursor-not-allowed disabled:bg-[linear-gradient(135deg,var(--color-btn-disabled-start),var(--color-btn-disabled-end))] disabled:shadow-none"
            disabled={loading || !fullName || !pw || !cf}
          >
            {loading ? (
              <><div className="h-4 w-4 animate-[auth-spin_0.7s_linear_infinite] rounded-full border-2 border-[var(--color-spinner-track)] border-t-[var(--color-surface)]" /> Setting up...</>
            ) : (
              <>Complete Setup <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>

          {pw && (
            <div className="mt-2 flex w-full flex-col gap-1 text-[12px]">
              <span className={`flex items-center gap-1.5 font-medium ${passwordChecks.hasMinLength ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                {passwordChecks.hasMinLength ? <Check size={12} /> : <X size={12} />} Min 8 characters
              </span>
              <span className={`flex items-center gap-1.5 font-medium ${passwordChecks.hasUppercase ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                {passwordChecks.hasUppercase ? <Check size={12} /> : <X size={12} />} One uppercase letter
              </span>
              <span className={`flex items-center gap-1.5 font-medium ${passwordChecks.hasSpecial ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                {passwordChecks.hasSpecial ? <Check size={12} /> : <X size={12} />} One special character
              </span>
            </div>
          )}


        </form>
      </div>

      <Footer />
    </div>
  );
}