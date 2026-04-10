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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_60%_10%,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-auth-page-mid)_60%,var(--color-bg-page-end)_100%)] px-6 py-6 font-[var(--font-base)]">
      <div className="flex w-full max-w-[420px] flex-col items-center rounded-[var(--radius-page)] bg-[var(--color-surface)] px-11 pb-10 pt-12 shadow-[var(--shadow-card)]">

        {/* Shield */}
        <div className="mb-6 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[var(--radius-shield)] bg-[linear-gradient(145deg,var(--color-brand-xsubtle),var(--color-brand-subtle))] shadow-[var(--shadow-shield)]">
          <ShieldCheck size={24} fill="var(--color-brand)" color="var(--color-surface)" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1 className="mb-2.5 text-center text-[26px] font-bold tracking-[-0.5px] text-[var(--color-text-primary)]">
          Verify Identity
        </h1>
        <p className="mb-8 text-center text-[14.5px] leading-[1.55] text-[var(--color-text-secondary)]">
          We&apos;ve sent a 6-digit verification code<br />
          to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="w-full">

          {/* OTP inputs */}
          <div className="mb-6 flex w-full justify-center gap-2.5" onPaste={handlePaste}>
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
                className={`h-[58px] w-[52px] rounded-[var(--radius-input)] border-[1.5px] text-center text-[20px] font-semibold text-[var(--color-text-primary)] outline-none caret-[var(--color-brand)] ${v ? "border-[var(--color-brand-light)] bg-[var(--color-surface)]" : "border-[var(--color-input-border)] bg-[var(--color-input-bg)]"}`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 flex items-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--color-error)]">
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Timer + resend */}
          <div className="flex flex-col items-center">
            <p className="m-0 flex items-center justify-center gap-1.5 text-[13.5px] text-[var(--color-text-secondary)]">
              <Clock3 size={16} color="var(--color-brand)" aria-hidden="true" />
              Resend code in&nbsp;
              <span className="font-bold tabular-nums text-[var(--color-brand-deep)]">
                {fmt(timer)}
              </span>
            </p>

            <div className="mb-7 flex h-5 items-center justify-center">
              {timer === 0 ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="bg-transparent p-0 text-[13.5px] font-semibold text-[var(--color-brand)] underline underline-offset-2"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-[13.5px] font-medium text-[var(--color-brand-light)]">
                  Resend Code
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isComplete || loading}
            className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] px-6 py-[17px] text-[15.5px] font-bold text-[var(--color-surface)] transition-all duration-200 ${!isComplete || loading ? "cursor-not-allowed bg-[linear-gradient(135deg,var(--color-btn-disabled-start),var(--color-btn-disabled-end))" : "bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:-translate-y-px hover:opacity-95 hover:shadow-[var(--shadow-btn-hover)]"}`}
          >
            {loading
              ? <><span className="inline-block h-[18px] w-[18px] animate-[auth-spin_0.7s_linear_infinite] rounded-full border-[2.5px] border-[var(--color-spinner-track)] border-t-[var(--color-surface)]" /> Verifying...</>
              : <>Verify &amp; Sign In <ArrowRight size={18} aria-hidden="true" /></>
            }
          </button>

        </form>

        {/* Encrypted badge */}
        <p className="mt-7 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.9px] text-[var(--color-text-faint)]">
          <LockKeyhole size={12} aria-hidden="true" />
          End-to-end encrypted verification
        </p>

      </div>
      <Footer />
    </div>
  );
}