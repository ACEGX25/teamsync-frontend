"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield, AlertCircle, Info ,Check, X} from "lucide-react";



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
  onNext?: () => void;
}

export default function StepSecure({ onNext }: Props) {
  const [pw, setPw] = useState("");
  const [cf, setCf] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const strength = getStrength(pw);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cf) { setError("Passwords do not match."); return; }
    if (strength.level < 2) { setError("Please choose a stronger password."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext?.(); }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-shield">
          <Shield size={24} fill="var(--color-brand)" color="white" />
        </div>

        <h1 className="auth-title">Secure Your Account</h1>
        <p className="auth-sub">
          Choose a sophisticated password to<br />protect your digital workspace.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className={`auth-input${name ? " has-value" : ""}`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
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
                placeholder="Enter a strong password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
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
                placeholder="Retype the Password"
                value={cf}
                onChange={(e) => { setCf(e.target.value); setError(""); }}
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowCf(!showCf)} tabIndex={-1}>
                {showCf ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              <AlertCircle size={15} color="var(--color-error)" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !name || !pw || !cf || pw !== cf || strength.level < 2}
          >
            {loading ? (
              <><div className="auth-spinner" /> Setting up...</>
            ) : (
              <>Complete Setup <span style={{ fontSize: 18 }}>→</span></>
            )}
          </button>

          {/* Hint */}
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
              <span className={pw.length >= 12 ? "auth-hint-met" : "auth-hint-unmet"}>
                {pw.length >= 12 ? <Check size={12} /> : <X size={12} />} 12+ characters for optimal
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