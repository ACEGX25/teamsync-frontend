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
  const [otp, setOtp]       = useState(Array(6).fill(""));
  const [timer, setTimer]   = useState(114);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

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
      await registrationApi.initiateRegister(email);
      setTimer(114);
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP.";
      setError(message);
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
      const message = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(message);
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.join("").length === 6;

  return (
    <div className="min-h-screen px-6 py-8 bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-bg-page-end)_100%)] font-[var(--font-base)] flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] rounded-[var(--radius-page)] px-11 pt-12 pb-10 shadow-[var(--shadow-card)] flex flex-col items-center">

        {/* Shield */}
        <div className="w-[52px] h-[52px] rounded-[var(--radius-shield)] mb-6 flex items-center justify-center bg-[linear-gradient(145deg,var(--color-brand-xsubtle),var(--color-brand-subtle))] shadow-[var(--shadow-shield)]">
          <ShieldCheck size={24} fill="var(--color-brand)" color="var(--color-surface)" aria-hidden="true" />
        </div>

        <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-[-0.5px] mb-2.5 text-center">Verify Identity</h1>
        <p className="text-[14.5px] text-[var(--color-text-secondary)] text-center leading-[1.55] mb-8">
          We&apos;ve sent a 6-digit verification code<br />
          to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          {/* OTP inputs */}
          <div className="w-full grid grid-cols-6 gap-2.5 mb-4" onPaste={handlePaste}>
            {otp.map((v, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                className="h-[52px] rounded-[var(--radius-input)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-center text-[18px] font-semibold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
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
            <p className="mb-4 text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-[var(--radius-input)] px-3.5 py-2.5 flex items-center gap-2">
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Timer */}
          <div className="flex flex-col items-center">
            <p className="text-[13px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <Clock3 className="text-[var(--color-brand)]" size={16} aria-hidden="true" />
              Resend code in <span className="text-[var(--color-brand-deep)] font-semibold">{fmt(timer)}</span>
            </p>
            <div className="mt-1 mb-2">
              {timer === 0 ? (
                <button type="button" className="text-[13px] text-[var(--color-brand)] font-semibold hover:opacity-75" onClick={handleResend}>
                  Resend Code
                </button>
              ) : (
                <span className="text-[13px] text-[var(--color-brand-light)]">Resend Code</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            disabled={!isComplete || loading}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)]/50 border-t-[var(--color-surface)] animate-spin" />
                Verifying...
              </>
            ) : (
              <>Verify &amp; Sign In <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>
        </form>

        <p className="mt-4 text-[12px] text-[var(--color-text-muted)] flex items-center gap-1.5">
          <LockKeyhole size={12} aria-hidden="true" />
          End-to-end encrypted verification
        </p>
      </div>

      <Footer />
    </div>
  );
}