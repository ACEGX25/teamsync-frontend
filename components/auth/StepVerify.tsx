"use client";

import { useState, useRef, useEffect } from "react";
import { AlertCircle, ArrowRight, Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { registrationApi } from "@/utils/auth/registrationApi";
import Footer from "@/shared/Footer";

interface Props {
  email: string;
  onNext?: () => void;
}

export default function StepVerify({ email, onNext }: Props) {
  const [otp, setOtp]         = useState(Array(6).fill(""));
  const [timer, setTimer]     = useState(114);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

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
    if (e.key === "Backspace" && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus();
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
      await registrationApi.initiateRegister(email);
      setTimer(114);
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registrationApi.verifyRegisterOtp(email, otp.join(""));
      onNext?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.join("").length === 6;

  // ── Shared styles ─────────────────────────────────────────────
  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "17px 24px",
    background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
    color: "var(--color-surface)",
    border: "none",
    borderRadius: "var(--radius-btn)",
    fontSize: 15.5,
    fontWeight: 700,
    fontFamily: "var(--font-base)",
    cursor: "pointer",
    boxShadow: "var(--shadow-btn)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  const btnDisabledStyle: React.CSSProperties = {
    ...btnStyle,
    background: "linear-gradient(135deg, var(--color-btn-disabled-start), var(--color-btn-disabled-end))",
    boxShadow: "none",
    cursor: "not-allowed",
  };

  const spinnerStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    animation: "auth-spin 0.7s linear infinite",
    display: "inline-block",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 60% 10%, var(--color-bg-page-start) 0%, var(--color-bg-page-mid) 30%, #eef0f8 60%, var(--color-bg-page-end) 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-base)",
      padding: 24,
    }}>
      <div style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-page)",
        padding: "48px 44px 40px",
        width: "100%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "var(--shadow-card)",
      }}>

        {/* Shield */}
        <div style={{
          width: 52,
          height: 52,
          background: "linear-gradient(145deg, var(--color-brand-xsubtle), var(--color-brand-subtle))",
          borderRadius: "var(--radius-shield)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "var(--shadow-shield)",
          flexShrink: 0,
        }}>
          <ShieldCheck size={24} fill="var(--color-brand)" color="white" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.5px",
          marginBottom: 10,
          textAlign: "center",
        }}>
          Verify Identity
        </h1>
        <p style={{
          fontSize: 14.5,
          color: "var(--color-text-secondary)",
          textAlign: "center",
          lineHeight: 1.55,
          marginBottom: 32,
        }}>
          We&apos;ve sent a 6-digit verification code<br />
          to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>

          {/* OTP inputs */}
          <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center", marginBottom: 24 }} onPaste={handlePaste}>
            {otp.map((v, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={v}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKey(e, i)}
                autoComplete="one-time-code"
                style={{
                  width: 52,
                  height: 58,
                  border: `1.5px solid ${v ? "var(--color-brand-light)" : "var(--color-input-border)"}`,
                  borderRadius: "var(--radius-input)",
                  background: v ? "var(--color-surface)" : "var(--color-input-bg)",
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-base)",
                  outline: "none",
                  caretColor: "var(--color-brand)",
                }}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontSize: 13,
              color: "var(--color-error)",
              background: "var(--color-error-bg)",
              border: "1px solid var(--color-error-border)",
              borderRadius: "var(--radius-input)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 16,
              margin: "0 0 16px",
            }}>
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Timer + resend */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13.5,
              color: "var(--color-text-secondary)",
              justifyContent: "center",
              margin: 0,
            }}>
              <Clock3 size={16} color="var(--color-brand)" aria-hidden="true" />
              Resend code in&nbsp;
              <span style={{ color: "var(--color-brand-deep)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {fmt(timer)}
              </span>
            </p>

            <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
              {timer === 0 ? (
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--color-brand)",
                    fontFamily: "var(--font-base)",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                    padding: 0,
                  }}
                >
                  Resend Code
                </button>
              ) : (
                <span style={{ fontSize: 13.5, color: "var(--color-brand-light)", fontWeight: 500 }}>
                  Resend Code
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isComplete || loading}
            style={!isComplete || loading ? btnDisabledStyle : btnStyle}
          >
            {loading
              ? <><span style={spinnerStyle} /> Verifying...</>
              : <>Verify &amp; Sign In <ArrowRight size={18} aria-hidden="true" /></>
            }
          </button>

        </form>

        {/* Encrypted badge */}
        <p style={{
          marginTop: 28,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.9,
          color: "var(--color-text-faint)",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 5,
          margin: "28px 0 0",
        }}>
          <LockKeyhole size={12} aria-hidden="true" />
          End-to-end encrypted verification
        </p>

      </div>
      <Footer />
    </div>
  );
}