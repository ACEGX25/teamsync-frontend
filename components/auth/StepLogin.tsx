"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff  } from "lucide-react";
import { authApi } from "@/utils/api";
import Footer from "@/shared/Footer";
import {
  isPrimaverseEmail,
  sanitizePrimaverseEmailInput,
  toPrimaverseEmail,
} from "@/utils/validation/LoginValidation";

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  email?: string;
  onNext?: () => void;
  onBack?: () => void;
  onForgot?: () => void;
}

export default function StepLogin({ email = "", onNext, onBack, onForgot }: Props) {
  const router = useRouter();
  const [mail, setMail]       = useState(sanitizePrimaverseEmailInput(email));
  const [pw, setPw]           = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = toPrimaverseEmail(mail);
    if (!isPrimaverseEmail(normalizedEmail)) {
      setError("Only @primaverse.com emails are allowed.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authApi.login(normalizedEmail, pw);
      onNext?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password.";
      setError(message);
      setPw("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-bg-page-end)_100%)] font-[var(--font-base)] flex flex-col items-center">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] rounded-[var(--radius-page)] px-11 pt-12 pb-10 shadow-[var(--shadow-card)] flex flex-col items-start">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-[-0.5px] text-left">Welcome back.</h1>
          <p className="mt-2 text-[14.5px] text-[var(--color-text-secondary)] leading-[1.55] text-left">Enter your details to access your atelier.</p>
        </div>

        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase">Email Address</label>
            <input
              type="email"
              className="w-full py-3.5 px-4 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
              placeholder="name@primaverse.com"
              value={mail}
              onChange={(e) => { setMail(sanitizePrimaverseEmailInput(e.target.value)); setError(""); }}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase">Password</label>
              <button
                type="button"
                className="text-[12px] text-[var(--color-brand)] font-semibold hover:opacity-80"
                onClick={() => {
                  if (onForgot) {
                    onForgot();
                    return;
                  }
                  router.push("/auth/forgot-password");
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
                placeholder="Enter Password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3.5 p-1 text-[var(--color-text-faint)] hover:text-[var(--color-brand)]"
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="w-full text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-[var(--radius-input)] px-3.5 py-2.5 flex items-center gap-2">
              <AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-1 py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            disabled={loading || !mail || !pw}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)]/50 border-t-[var(--color-surface)] animate-spin" />
                Signing in...
              </>
            ) : (
              <>Sign In <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>

          {/* Divider */}
          <div className="w-full mt-4 mb-2 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-divider)]" />
            <span className="text-[12px] text-[var(--color-text-faint)]">Don&apos;t have an account?</span>
            <div className="h-px flex-1 bg-[var(--color-divider)]" />
          </div>

          <p className="w-full text-center text-[13px] text-[var(--color-text-muted)]">
            <button type="button" className="text-[var(--color-brand)] font-semibold hover:opacity-80" onClick={onBack}>
              Join TeamSync now
            </button>
          </p>

        </form>
      </div>

      {/* Social proof */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(145deg,var(--color-brand-light),var(--color-brand))]" />
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(145deg,var(--color-success),var(--color-brand-deep))] -ml-2" />
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(145deg,var(--color-warn),var(--color-brand))] -ml-2" />
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand)] text-[11px] font-bold flex items-center justify-center -ml-2">+12</div>
        </div>
        <span className="text-[12px] text-[var(--color-text-faint)]">Collaborating in TeamSync today</span>
      </div>

      <Footer />
    </div>
  );
}