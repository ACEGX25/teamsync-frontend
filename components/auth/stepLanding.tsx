"use client";

import { useState } from "react";
import { AlertCircle, Aperture } from "lucide-react";
import { registrationApi } from "@/utils/auth/registrationApi";
import {
  isPrimaverseEmail,
  sanitizePrimaverseEmailInput,
  toPrimaverseEmail,
} from "@/utils/validation/LoginValidation";

type Step = "landing" | "verify" | "secure" | "login";

interface Props {
  onNext: (email: string, step?: Step) => void;
}

export default function StepLanding({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = toPrimaverseEmail(email.trim());
    if (!isPrimaverseEmail(normalizedEmail)) {
      setError("Only @primaverse.com emails are allowed.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await registrationApi.initiateRegister(normalizedEmail);
      onNext(normalizedEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-landing-bg)] font-[var(--font-base)]">
      <div className="w-full max-w-[460px] rounded-[28px] bg-[var(--color-surface)] border border-[var(--color-landing-card-border)] px-10 pt-11 pb-9 shadow-[var(--shadow-landing-card)] flex flex-col items-center">

        {/* Floating orb with concentric rings */}
        <div className="relative h-[120px] w-[120px] mb-6 flex items-center justify-center">
          <div className="absolute h-[120px] w-[120px] rounded-full border border-[color:var(--color-brand-light)]/20" />
          <div className="absolute h-[92px] w-[92px] rounded-full border border-[color:var(--color-brand-light)]/30" />
          <div className="absolute h-[70px] w-[70px] rounded-full border border-[color:var(--color-brand)]/35" />
          <div className="h-[56px] w-[56px] rounded-2xl bg-[linear-gradient(145deg,var(--color-orb-start),var(--color-orb-end))] flex items-center justify-center shadow-[var(--shadow-orb)]">
            <Aperture size={28} color="var(--color-surface)" aria-hidden="true" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-[34px] font-black tracking-[-0.9px] text-[var(--color-text-primary)]">TeamSync</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[1.9px] text-[var(--color-text-muted)]">Synchronized Collaboration</div>
        <div className="mt-3 text-[14px] leading-[1.55] text-[var(--color-text-secondary)] text-center max-w-[340px]">
          Seamless communication and real-time collaboration, all in one place.
        </div>

        {/* Form */}
        <form className="w-full mt-7" onSubmit={handle}>
          <div className="h-[54px] w-full rounded-[15px] border border-[var(--color-landing-input-border)] bg-[var(--color-landing-input-bg)] flex items-center gap-2 px-3">
            <span className="text-[var(--color-text-muted)] font-bold">@</span>
            <input
              type="email"
              className="flex-1 bg-transparent outline-none text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)]"
              placeholder="your email"
              value={email}
              onChange={(e) => { setEmail(sanitizePrimaverseEmailInput(e.target.value)); setError(""); }}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              className="h-10 px-4 rounded-[11px] bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] text-[var(--color-surface)] text-[13px] font-bold hover:opacity-95 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Sending..." : "Verify"}
            </button>
          </div>

          {error && (
            <p className="mt-3 mb-2 rounded-full border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3 py-2 text-[12px] text-[var(--color-error)] flex items-center gap-1.5">
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          <p className="mt-1 text-center text-[13px] text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-[var(--color-brand-deep)] underline underline-offset-2 hover:opacity-80"
              onClick={() => onNext(toPrimaverseEmail(email), "login")}
            >
              Log in
            </button>
          </p>
        </form>

        {/* Live status badge */}
        <div className="mt-7 rounded-full border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-1.5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span className="text-[12px] font-semibold text-[var(--color-text-secondary)]">Live &amp; Secure</span>
        </div>

      </div>
    </div>
  );
}