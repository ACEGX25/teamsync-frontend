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
    <div className="min-h-screen px-6 py-8 bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-bg-page-end)_100%)] font-[var(--font-base)] flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] rounded-[var(--radius-page)] px-11 pt-12 pb-10 shadow-[var(--shadow-card)] flex flex-col items-center">

        {/* Shield */}
        <div className="w-[52px] h-[52px] rounded-[var(--radius-shield)] mb-6 flex items-center justify-center bg-[linear-gradient(145deg,var(--color-brand-xsubtle),var(--color-brand-subtle))] shadow-[var(--shadow-shield)]">
          <ShieldCheck size={24} fill="var(--color-brand)" color="var(--color-surface)" aria-hidden="true" />
        </div>

        <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-[-0.5px] mb-2.5 text-center">Secure Your Account</h1>
        <p className="text-[14.5px] text-[var(--color-text-secondary)] text-center leading-[1.55] mb-8">
          One last step — set your name<br />and a strong password.
        </p>

        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>

          {/* Full name */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase">Your Name</label>
            <input
              type="text"
              className="w-full py-3.5 px-4 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => { setFullName(sanitizeNameInput(e.target.value)); setError(""); }}
              required
              autoComplete="name"
            />
          </div>

          {/* New password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
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
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.8px] uppercase" style={{ color: strength.color }}>
                    Strength: {strength.label}
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 rounded-full"
                        style={{ background: d <= strength.level ? strength.color : "var(--color-input-border)" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-1 rounded-full bg-[var(--color-divider)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(strength.level / 4) * 100}%`, background: strength.color }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Confirm password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showCf ? "text" : "password"}
                className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
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
            <p className="w-full text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-[var(--radius-input)] px-3.5 py-2.5 flex items-center gap-2">
              <AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-1 py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            disabled={loading || !fullName || !pw || !cf}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)]/50 border-t-[var(--color-surface)] animate-spin" />
                Setting up...
              </>
            ) : (
              <>Complete Setup <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>

          {pw && (
            <div className="mt-1 flex flex-col gap-1 text-[12px]">
              <span className={`flex items-center gap-1.5 ${passwordChecks.hasMinLength ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                {passwordChecks.hasMinLength ? <Check size={12} /> : <X size={12} />} Min 8 characters
              </span>
              <span className={`flex items-center gap-1.5 ${passwordChecks.hasUppercase ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                {passwordChecks.hasUppercase ? <Check size={12} /> : <X size={12} />} One uppercase letter
              </span>
              <span className={`flex items-center gap-1.5 ${passwordChecks.hasSpecial ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
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