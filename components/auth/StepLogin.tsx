"use client";

import { useState } from "react";

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
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff /> : <EyeOpen />}
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
              <>Sign In <span style={{ fontSize: 18 }}>→</span></>
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