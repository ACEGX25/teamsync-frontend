"use client";

import { useState, useRef, useEffect } from "react";

// ─── Inline styles matching the screenshot exactly ───────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sv-page {
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
  .sv-card {
    background: #ffffff;
    border-radius: 28px;
    padding: 48px 44px 40px;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    box-shadow: 0 8px 40px rgba(100, 80, 160, 0.08), 0 2px 8px rgba(0,0,0,0.04);
  }

  /* Shield icon */
  .sv-shield-wrap {
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
  .sv-title {
    font-size: 26px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
    margin-bottom: 12px;
    text-align: center;
  }

  /* Subtitle */
  .sv-sub {
    font-size: 14.5px;
    color: #7a7a9a;
    text-align: center;
    line-height: 1.55;
    margin-bottom: 32px;
  }

  /* OTP row */
  .sv-otp-row {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    width: 100%;
    justify-content: center;
  }

  .sv-otp-box {
    width: 52px;
    height: 58px;
    border: 1.5px solid #e2e0f0;
    border-radius: 12px;
    background: #fafafa;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a2e;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
    caret-color: #7c5cbf;
  }

  .sv-otp-box:focus {
    border-color: #7c5cbf;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(124, 92, 191, 0.12);
  }

  .sv-otp-box.filled {
    border-color: #b8a8e0;
    background: #fff;
  }

  /* Timer */
  .sv-timer-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13.5px;
    color: #6b6b8a;
    margin-bottom: 8px;
  }

  .sv-timer-val {
    color: #5a3fa0;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .sv-timer-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #7c5cbf;
  }

  /* Resend */
  .sv-resend-row {
    margin-bottom: 28px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sv-resend-active {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 600;
    color: #7c5cbf;
    font-family: 'DM Sans', sans-serif;
    text-decoration: underline;
    text-underline-offset: 2px;
    padding: 0;
    transition: opacity 0.15s;
  }
  .sv-resend-active:hover { opacity: 0.75; }

  .sv-resend-inactive {
    font-size: 13.5px;
    color: #b0aec8;
    font-weight: 500;
  }

  /* Submit button */
  .sv-btn {
    width: 100%;
    padding: 17px 24px;
    background: linear-gradient(135deg, #7c5cbf 0%, #6241a8 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 15.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.1px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 6px 20px rgba(98, 65, 168, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .sv-btn:hover:not(:disabled) {
    opacity: 0.93;
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(98, 65, 168, 0.42);
  }

  .sv-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .sv-btn:disabled {
    background: linear-gradient(135deg, #b3a3d8 0%, #a090c8 100%);
    box-shadow: none;
    cursor: not-allowed;
  }

  .sv-btn.loading {
    pointer-events: none;
  }

  /* Encrypted badge */
  .sv-encrypt {
    margin-top: 28px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.9px;
    color: #a0a0be;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Footer */
  .sv-footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 680px;
    font-size: 12px;
    color: #a0a0be;
  }

  .sv-footer a {
    color: #a0a0be;
    text-decoration: none;
    transition: color 0.15s;
  }
  .sv-footer a:hover { color: #7c5cbf; }

  .sv-footer-links {
    display: flex;
    gap: 20px;
  }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .sv-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
`;

interface Props {
  email?: string;
  onNext?: () => void;
}

export default function StepVerify({ email = "your registered device", onNext }: Props) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(114);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext?.();
    }, 1200);
  };

  const isComplete = otp.join("").length === 6;

  return (
    <>
      <style>{styles}</style>
      <div className="sv-page">
        <div className="sv-card">
          {/* Shield icon */}
          <div className="sv-shield-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
                fill="#7c5cbf"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="sv-title">Verify Identity</h1>
          <p className="sv-sub">
            We&apos;ve sent a 6-digit verification code<br />
            to your registered device.
          </p>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {/* OTP inputs */}
            <div className="sv-otp-row" onPaste={handlePaste}>
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  className={`sv-otp-box${v ? " filled" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKey(e, i)}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Timer */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <p className="sv-timer-row">
                <svg className="sv-timer-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Resend code in&nbsp;<span className="sv-timer-val">{fmt(timer)}</span>
              </p>

              <div className="sv-resend-row">
                {timer === 0 ? (
                  <button
                    type="button"
                    className="sv-resend-active"
                    onClick={() => { setTimer(114); setOtp(Array(6).fill("")); }}
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="sv-resend-inactive">Resend Code</span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`sv-btn${loading ? " loading" : ""}`}
              disabled={!isComplete || loading}
            >
              {loading ? (
                <><div className="sv-spinner" /> Verifying...</>
              ) : (
                <>Verify &amp; Sign In <span style={{ fontSize: 18 }}>→</span></>
              )}
            </button>
          </form>

          {/* Encrypted badge */}
          <p className="sv-encrypt">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            End-to-end encrypted verification
          </p>
        </div>

        {/* Footer */}
        <footer className="sv-footer">
          <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
          <div className="sv-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </footer>
      </div>
    </>
  );
}