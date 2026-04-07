"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Info, ShieldCheck ,Check ,X } from "lucide-react";
import { authApi } from "@/utils/api";

// ─── Strength helper ──────────────────────────────────────────────────────────
function getStrength(pw: string): { label: string; level: number; color: string } {
  if (!pw) return { label: "", level: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 1) return { label: "WEAK", level: 1, color: "#ef4444" };
  if (score === 2) return { label: "FAIR", level: 2, color: "#f59e0b" };
  if (score === 3) return { label: "STRONG", level: 3, color: "#8b5cf6" };
  return { label: "OPTIMAL", level: 4, color: "#6d28d9" };
}

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

  const strength = getStrength(pw);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cf) { setError("Passwords do not match."); return; }
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
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value.replace(/[^A-Za-z\s]/g, "")); setError(""); }}
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
              <span className={pw.length >= 8 ? "auth-hint-met" : "auth-hint-unmet"}>
                {pw.length >= 8 ? <Check size={12} /> : <X size={12} />} Min 8 characters
              </span>
              <span className={/[A-Z]/.test(pw) ? "auth-hint-met" : "auth-hint-unmet"}>
                {/[A-Z]/.test(pw) ? <Check size={12} /> : <X size={12} />} One uppercase letter
              </span>
              <span className={/[^a-zA-Z0-9]/.test(pw) ? "auth-hint-met" : "auth-hint-unmet"}>
                {/[^a-zA-Z0-9]/.test(pw) ? <Check size={12} /> : <X size={12} />} One special character
              </span>
            </div>
          )}


        </form>
      </div>

      <footer className="auth-footer">
        <span>© 2026 TeamSync Digital Atelier. All rights reserved.</span>
        <div className="auth-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  );
}