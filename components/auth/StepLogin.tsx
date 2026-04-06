"use client";

import { useState } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sl-page {
    min-height: 100vh;
    background: radial-gradient(ellipse at 60% 10%, #e8e4f3 0%, #f0eef8 30%, #eef0f8 60%, #e8ecf5 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  /* Card */
  .sl-card {
    background: #ffffff;
    border-radius: 28px;
    padding: 48px 44px 40px;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 40px rgba(100, 80, 160, 0.08), 0 2px 8px rgba(0,0,0,0.04);
  }

  /* Header */
  .sl-header {
    margin-bottom: 32px;
  }

  .sl-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.6px;
    margin-bottom: 8px;
  }

  .sl-sub {
    font-size: 14.5px;
    color: #7a7a9a;
    line-height: 1.55;
  }

  /* Form */
  .sl-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Field */
  .sl-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .sl-field-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sl-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.9px;
    color: #9090b0;
    text-transform: uppercase;
  }

  .sl-forgot {
    font-size: 12px;
    font-weight: 600;
    color: #7c5cbf;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: opacity 0.15s;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    padding: 0;
  }
  .sl-forgot:hover { opacity: 0.72; }

  /* Input */
  .sl-input {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid #e2e0f0;
    border-radius: 12px;
    background: #fafafa;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a2e;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .sl-input::placeholder { color: #c0bed8; }

  .sl-input:focus {
    border-color: #7c5cbf;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(124, 92, 191, 0.12);
  }

  .sl-input.has-value {
    border-color: #b8a8e0;
    background: #fff;
  }

  /* Password wrap */
  .sl-pw-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .sl-pw-wrap .sl-input {
    padding-right: 48px;
  }

  .sl-eye {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    color: #a0a0be;
    transition: color 0.15s;
  }
  .sl-eye:hover { color: #7c5cbf; }

  /* Submit */
  .sl-btn {
    width: 100%;
    padding: 17px 24px;
    background: linear-gradient(135deg, #7c5cbf 0%, #6241a8 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 15.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 6px 20px rgba(98, 65, 168, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }

  .sl-btn:hover:not(:disabled) {
    opacity: 0.93;
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(98, 65, 168, 0.42);
  }

  .sl-btn:active:not(:disabled) { transform: translateY(0); }

  .sl-btn:disabled {
    background: linear-gradient(135deg, #b3a3d8 0%, #a090c8 100%);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* Hint */
  .sl-hint {
    font-size: 13.5px;
    color: #9090b0;
    text-align: center;
  }

  .sl-link {
    color: #7c5cbf;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .sl-link:hover { opacity: 0.72; }

  /* Divider */
  .sl-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 4px 0;
  }

  .sl-divider-line {
    flex: 1;
    height: 1px;
    background: #ece9f8;
  }

  .sl-divider-txt {
    font-size: 12px;
    font-weight: 500;
    color: #b0aec8;
    white-space: nowrap;
  }

  /* Social proof */
  .sl-social {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sl-avatars {
    display: flex;
    align-items: center;
  }

  .sl-av {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-left: -8px;
    background-size: cover;
    background-position: center;
  }

  .sl-av:first-child { margin-left: 0; }

  .sl-av-1 { background: linear-gradient(135deg, #a78bfa, #7c5cbf); }
  .sl-av-2 { background: linear-gradient(135deg, #6ee7b7, #3b82f6); }
  .sl-av-3 { background: linear-gradient(135deg, #fca5a5, #f472b6); }

  .sl-av-count {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-left: -8px;
    background: #ede9fb;
    color: #7c5cbf;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }

  .sl-social-txt {
    font-size: 12.5px;
    color: #9090b0;
    font-weight: 500;
  }

  /* Footer */
  .sl-footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 680px;
    font-size: 12px;
    color: #a0a0be;
  }

  .sl-footer a {
    color: #a0a0be;
    text-decoration: none;
    transition: color 0.15s;
  }
  .sl-footer a:hover { color: #7c5cbf; }

  .sl-footer-links { display: flex; gap: 20px; }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .sl-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
`;

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
  const [mail, setMail]     = useState(email);
  const [pw, setPw]         = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext?.();
    }, 1000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sl-page">
        <div className="sl-card">

          {/* Header */}
          <div className="sl-header">
            <h1 className="sl-title">Welcome back.</h1>
            <p className="sl-sub">Enter your details to access your atelier.</p>
          </div>

          <form className="sl-form" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="sl-field">
              <label className="sl-label">Email Address</label>
              <input
                type="email"
                className={`sl-input${mail ? " has-value" : ""}`}
                placeholder="name@atelier.com"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="sl-field">
              <div className="sl-field-row">
                <label className="sl-label">Password</label>
                <button type="button" className="sl-forgot">Forgot Password?</button>
              </div>
              <div className="sl-pw-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  className={`sl-input${pw ? " has-value" : ""}`}
                  placeholder="••••••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="sl-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="sl-btn"
              disabled={loading || !mail || !pw}
            >
              {loading ? (
                <><div className="sl-spinner" /> Signing in...</>
              ) : (
                <>Sign In <span style={{ fontSize: 18 }}>→</span></>
              )}
            </button>

            {/* Divider */}
            <div className="sl-divider">
              <div className="sl-divider-line" />
              <span className="sl-divider-txt">Don&apos;t have an account?</span>
              <div className="sl-divider-line" />
            </div>

            {/* Join link */}
            <p className="sl-hint">
              <button type="button" className="sl-link" onClick={onBack}>
                Join TeamSync now
              </button>
            </p>
          </form>
        </div>

        {/* Social proof */}
        <div className="sl-social">
          <div className="sl-avatars">
            <div className="sl-av sl-av-1" />
            <div className="sl-av sl-av-2" />
            <div className="sl-av sl-av-3" />
            <div className="sl-av-count">+12</div>
          </div>
          <span className="sl-social-txt">Collaborating in TeamSync today</span>
        </div>

        {/* Footer */}
        <footer className="sl-footer">
          <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
          <div className="sl-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </footer>
      </div>
    </>
  );
}