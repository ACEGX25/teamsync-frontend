"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  email?: string;
  onNext?: () => void;
  onBack?: () => void;
}

export default function StepLogin({ email = "", onNext, onBack }: Props) {
  const [mail, setMail]       = useState(email);
  const [pw, setPw]           = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext?.(); }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ alignItems: "flex-start" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="auth-title auth-title--left">Welcome back.</h1>
          <p className="auth-sub auth-sub--left">Enter your details to access your atelier.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className={`auth-input${mail ? " has-value" : ""}`}
              placeholder="name@atelier.com"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-field-row">
              <label className="auth-label">Password</label>
              <button type="button" className="auth-forgot">Forgot Password?</button>
            </div>
            <div className="auth-pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                className={`auth-input${pw ? " has-value" : ""}`}
                placeholder="Enter your password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !mail || !pw}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <><div className="auth-spinner" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-txt">Don&apos;t have an account?</span>
            <div className="auth-divider-line" />
          </div>

          {/* Back to landing */}
          <p className="auth-hint">
            <button type="button" className="auth-link" onClick={onBack}>
              Join TeamSync now
            </button>
          </p>

        </form>
      </div>

      {/* Social proof */}
      <div className="auth-social">
        <div className="auth-avatars">
          <div className="auth-av auth-av-1" />
          <div className="auth-av auth-av-2" />
          <div className="auth-av auth-av-3" />
          <div className="auth-av-count">+12</div>
        </div>
        <span className="auth-social-txt">Collaborating in TeamSync today</span>
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