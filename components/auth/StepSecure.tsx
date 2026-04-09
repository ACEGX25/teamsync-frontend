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
    <div className="auth-page">
      <div className="auth-card">

        {/* Shield */}
        <div style={{
  width: 52,
  height: 52,
  background: "linear-gradient(145deg, var(--color-brand-xsubtle), var(--color-brand-subtle))",
  borderRadius: "var(--radius-shield)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 24,
  boxShadow: "var(--shadow-shield)",
  flexShrink: 0,
}}>
  <ShieldCheck size={24} fill="var(--color-brand)" color="white" aria-hidden="true" />
</div>

        <h1 className="auth-title">Secure Your Account</h1>
        <p className="auth-sub">
          One last step — set your name<br />and a strong password.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Full name */}
          <div className="auth-field">
            <label className="auth-label">Your Name</label>
            <input
              type="text"
              className={`auth-input${fullName ? " has-value" : ""}`}
              placeholder="Your Name"
              value={fullName}
              onChange={(e) => { setFullName(sanitizeNameInput(e.target.value)); setError(""); }}
              required
              autoComplete="name"
            />
          </div>

          {/* New password */}
          <div className="auth-field">
            <label className="auth-label">New Password</label>
            <div className="auth-pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                className={`auth-input${pw ? " has-value" : ""}`}
                placeholder="Enter Password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>

            {/* Strength meter */}
            {pw && (
              <>
                <div className="auth-str-row">
                  <span className="auth-str-label" style={{ color: strength.color }}>
                    Strength: {strength.label}
                  </span>
                  <div className="auth-str-dots">
                    {[1, 2, 3, 4].map((d) => (
                      <span
                        key={d}
                        className="auth-str-dot"
                        style={{ background: d <= strength.level ? strength.color : "var(--color-input-border)" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="auth-str-bar">
                  <div
                    className="auth-str-fill"
                    style={{ width: `${(strength.level / 4) * 100}%`, background: strength.color }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Confirm password */}
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-pw-wrap">
              <input
                type={showCf ? "text" : "password"}
                className={`auth-input${cf ? " has-value" : ""}`}
                placeholder="Retype Password"
                value={cf}
                onChange={(e) => { setCf(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowCf(!showCf)} tabIndex={-1}>
                {showCf ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              <AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !fullName || !pw || !cf}
          >
            {loading ? (
              <><div className="auth-spinner" /> Setting up...</>
            ) : (
              <>Complete Setup <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>

          {pw && (
            <div className="auth-pw-hints">
              <span className={passwordChecks.hasMinLength ? "auth-hint-met" : "auth-hint-unmet"}>
                {passwordChecks.hasMinLength ? <Check size={12} /> : <X size={12} />} Min 8 characters
              </span>
              <span className={passwordChecks.hasUppercase ? "auth-hint-met" : "auth-hint-unmet"}>
                {passwordChecks.hasUppercase ? <Check size={12} /> : <X size={12} />} One uppercase letter
              </span>
              <span className={passwordChecks.hasSpecial ? "auth-hint-met" : "auth-hint-unmet"}>
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