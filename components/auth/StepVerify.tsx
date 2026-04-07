"use client";

import { useState, useRef, useEffect } from "react";
import { authApi } from "@/utils/api";

interface Props {
  email: string;
  onNext?: () => void;
}

export default function StepVerify({ email, onNext }: Props) {
  const [otp, setOtp]       = useState(Array(6).fill(""));
  const [timer, setTimer]   = useState(114);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
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
    setError("");
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

  const handleResend = async () => {
    setError("");
    try {
      await authApi.initiateRegister(email);
      setTimer(114);
      setOtp(Array(6).fill(""));
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(email, otp.join(""));
      onNext?.();
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.join("").length === 6;

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

        <h1 className="auth-title">Verify Identity</h1>
        <p className="auth-sub">
          We&apos;ve sent a 6-digit verification code<br />
          to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* OTP inputs */}
          <div className="auth-otp-row" onPaste={handlePaste}>
            {otp.map((v, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                className={`auth-otp-box${v ? " filled" : ""}`}
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

          {/* Error */}
          {error && (
            <p className="auth-error" style={{ marginBottom: 16 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--color-error)">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}

          {/* Timer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="auth-timer-row">
              <svg className="auth-timer-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Resend code in&nbsp;<span className="auth-timer-val">{fmt(timer)}</span>
            </p>
            <div className="auth-resend-row">
              {timer === 0 ? (
                <button type="button" className="auth-resend-active" onClick={handleResend}>
                  Resend Code
                </button>
              ) : (
                <span className="auth-resend-inactive">Resend Code</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-btn" disabled={!isComplete || loading}>
            {loading ? (
              <><div className="auth-spinner" /> Verifying...</>
            ) : (
              <>Verify &amp; Sign In <span style={{ fontSize: 18 }}>→</span></>
            )}
          </button>
        </form>

        <p className="auth-encrypt">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          End-to-end encrypted verification
        </p>
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