"use client";

import { useState } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ss-page {
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
  .ss-card {
    background: #ffffff;
    border-radius: 28px;
    padding: 48px 44px 40px;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 40px rgba(100, 80, 160, 0.08), 0 2px 8px rgba(0,0,0,0.04);
  }

  /* Shield */
  .ss-shield-wrap {
    width: 52px;
    height: 52px;
    background: linear-gradient(145deg, #f0ebff 0%, #e8e0fa 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(120, 80, 200, 0.12);
  }

  /* Title */
  .ss-title {
    font-size: 26px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
    margin-bottom: 10px;
    text-align: center;
  }

  /* Subtitle */
  .ss-sub {
    font-size: 14.5px;
    color: #7a7a9a;
    text-align: center;
    line-height: 1.55;
    margin-bottom: 32px;
  }

  /* Form */
  .ss-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Field group */
  .ss-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ss-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.9px;
    color: #9090b0;
    text-transform: uppercase;
  }

  /* Password wrapper */
  .ss-pw-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ss-input {
    width: 100%;
    padding: 14px 48px 14px 16px;
    border: 1.5px solid #e2e0f0;
    border-radius: 12px;
    background: #fafafa;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a2e;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .ss-input::placeholder { color: #c0bed8; }

  .ss-input:focus {
    border-color: #7c5cbf;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(124, 92, 191, 0.12);
  }

  .ss-input.has-value {
    border-color: #b8a8e0;
    background: #fff;
  }

  /* Eye toggle */
  .ss-eye {
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
  .ss-eye:hover { color: #7c5cbf; }

  /* Strength row */
  .ss-str-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }

  .ss-str-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    transition: color 0.2s;
  }

  .ss-str-dots {
    display: flex;
    gap: 5px;
  }

  .ss-str-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: background 0.25s;
  }

  .ss-str-bar {
    margin-top: 6px;
    height: 4px;
    background: #eeebf8;
    border-radius: 99px;
    overflow: hidden;
  }

  .ss-str-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.3s ease, background 0.3s ease;
  }

  /* Error */
  .ss-error {
    font-size: 13px;
    color: #ef4444;
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* Submit */
  .ss-btn {
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
  }

  .ss-btn:hover:not(:disabled) {
    opacity: 0.93;
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(98, 65, 168, 0.42);
  }

  .ss-btn:active:not(:disabled) { transform: translateY(0); }

  .ss-btn:disabled {
    background: linear-gradient(135deg, #b3a3d8 0%, #a090c8 100%);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* Hint */
  .ss-hint {
    font-size: 12.5px;
    color: #a0a0be;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  /* Assistance link */
  .ss-link {
    display: block;
    text-align: center;
    font-size: 13.5px;
    font-weight: 600;
    color: #7c5cbf;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.15s;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-link:hover { opacity: 0.72; }

  /* Footer */
  .ss-footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 680px;
    font-size: 12px;
    color: #a0a0be;
  }

  .ss-footer a {
    color: #a0a0be;
    text-decoration: none;
    transition: color 0.15s;
  }
  .ss-footer a:hover { color: #7c5cbf; }

  .ss-footer-links { display: flex; gap: 20px; }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .ss-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
`;

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

// ─── Eye icon ─────────────────────────────────────────────────────────────────
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
  onNext?: () => void;
}

export default function StepSecure({ onNext }: Props) {
  const [pw, setPw]         = useState("");
  const [cf, setCf]         = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(pw);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cf)          { setError("Passwords do not match."); return; }
    if (strength.level < 2) { setError("Please choose a stronger password."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext?.(); }, 1000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ss-page">
        <div className="ss-card">

          {/* Shield icon */}
          <div className="ss-shield-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="#7c5cbf" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="ss-title">Secure Your Account</h1>
          <p className="ss-sub">
            Choose a sophisticated password to<br />protect your digital workspace.
          </p>

          <form className="ss-form" onSubmit={handleSubmit}>

            {/* New password */}
            <div className="ss-field">
              <label className="ss-label">New Password</label>
              <div className="ss-pw-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  className={`ss-input${pw ? " has-value" : ""}`}
                  placeholder="••••••••••"
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setError(""); }}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="ss-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {/* Strength meter */}
              {pw && (
                <>
                  <div className="ss-str-row">
                    <span className="ss-str-label" style={{ color: strength.color }}>
                      Strength: {strength.label}
                    </span>
                    <div className="ss-str-dots">
                      {[1, 2, 3, 4].map((d) => (
                        <span
                          key={d}
                          className="ss-str-dot"
                          style={{ background: d <= strength.level ? strength.color : "#e0ddf0" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="ss-str-bar">
                    <div
                      className="ss-str-fill"
                      style={{ width: `${(strength.level / 4) * 100}%`, background: strength.color }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Confirm password */}
            <div className="ss-field">
              <label className="ss-label">Confirm Password</label>
              <div className="ss-pw-wrap">
                <input
                  type={showCf ? "text" : "password"}
                  className={`ss-input${cf ? " has-value" : ""}${error.includes("match") ? " ss-input--err" : ""}`}
                  placeholder="••••••••••"
                  value={cf}
                  onChange={(e) => { setCf(e.target.value); setError(""); }}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="ss-eye" onClick={() => setShowCf(!showCf)} tabIndex={-1}>
                  {showCf ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="ss-error">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="#ef4444">
                  <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="ss-btn"
              disabled={loading || !pw || !cf}
            >
              {loading ? (
                <><div className="ss-spinner" /> Setting up...</>
              ) : (
                <>Complete Setup <span style={{ fontSize: 18 }}>→</span></>
              )}
            </button>

            {/* Hint */}
            <p className="ss-hint">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="#a0a0be">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Min 8 characters, 1 uppercase, 1 symbol
            </p>

            <button type="button" className="ss-link">Need assistance?</button>
          </form>
        </div>

        {/* Footer */}
        <footer className="ss-footer">
          <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
          <div className="ss-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </footer>
      </div>
    </>
  );
}