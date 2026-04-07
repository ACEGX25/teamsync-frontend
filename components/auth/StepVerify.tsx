"use client";

import { useState, useRef, useEffect } from "react";
import { AlertCircle, ArrowRight, Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
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
          <ShieldCheck size={24} fill="var(--color-brand)" color="white" aria-hidden="true" />
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
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Timer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="auth-timer-row">
              <Clock3 className="auth-timer-icon" size={16} aria-hidden="true" />
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
              <>Verify &amp; Sign In <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>
        </form>

        <p className="auth-encrypt">
          <LockKeyhole size={12} aria-hidden="true" />
          End-to-end encrypted verification
        </p>
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