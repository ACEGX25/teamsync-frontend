"use client";

import { useState } from "react";
import { authApi } from "@/utils/api";

// ─── Eye icons ────────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Strength helper ──────────────────────────────────────────────────────────
function getStrength(pw: string): { label: string; level: number; color: string } {
  if (!pw) return { label: "", level: 0, color: "" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (pw.length >= 12)         score++;
  if (score <= 1) return { label: "WEAK",    level: 1, color: "#ef4444" };
  if (score === 2) return { label: "FAIR",    level: 2, color: "#f59e0b" };
  if (score === 3) return { label: "STRONG",  level: 3, color: "#8b5cf6" };
  return             { label: "OPTIMAL", level: 4, color: "#6d28d9" };
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  email: string;
  onNext?: () => void;
}

export default function StepSecure({ email, onNext }: Props) {
  const [fullName, setFullName] = useState("");
  const [pw, setPw]             = useState("");
  const [cf, setCf]             = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const strength = getStrength(pw);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cf)          { setError("Passwords do not match."); return; }
    if (strength.level < 2) { setError("Please choose a stronger password."); return; }
    setError("");
    setLoading(true);
    try {
      await authApi.completeRegister(email, fullName, pw);
      onNext?.();
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Shield */}
        <div className="auth-shield">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="var(--color-brand)" />
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="auth-title">Secure Your Account</h1>
        <p className="auth-sub">
          One last step — set your name<br />and a strong password.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Full name */}
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className={`auth-input${fullName ? " has-value" : ""}`}
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setError(""); }}
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
                placeholder="••••••••••"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff /> : <EyeOpen />}
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
                placeholder="••••••••••"
                value={cf}
                onChange={(e) => { setCf(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowCf(!showCf)} tabIndex={-1}>
                {showCf ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--color-error)">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
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
              <>Complete Setup <span style={{ fontSize: 18 }}>→</span></>
            )}
          </button>

          <p className="auth-hint">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--color-text-faint)">
              <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Min 8 characters, 1 uppercase, 1 symbol
          </p>

          <button type="button" className="auth-link" style={{ textAlign: "center" }}>
            Need assistance?
          </button>
        </form>
      </div>

      <footer className="auth-footer">
        <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
        <div className="auth-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  );
}