"use client";

import { useState } from "react";
import { AlertCircle, Aperture } from "lucide-react";
import { registrationApi } from "@/utils/auth/registrationApi";
import {
  isPrimaverseEmail,
  sanitizePrimaverseEmailInput,
  toPrimaverseEmail,
} from "@/utils/validation/LoginValidation";
import Footer from "@/shared/Footer";

type Step = "landing" | "verify" | "secure" | "login";

interface Props {
  onNext: (email: string, step?: Step) => void;
}

export default function StepLanding({ onNext }: Props) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-landing-bg)] px-6 py-6 font-[var(--font-base)]">
      <div className="flex w-full max-w-[420px] flex-col items-center rounded-[var(--radius-page)] border border-[var(--color-landing-card-border)] bg-[var(--color-surface)] px-8 pb-8 pt-10 shadow-[var(--shadow-landing-card)]">

        {/* Orb */}
        <div className="relative mb-6 flex h-[120px] w-[120px] items-center justify-center">
          <div className="absolute h-[138px] w-[138px] rounded-full border-[1.5px] border-[var(--color-orb-ring-3)]" />
          <div className="absolute h-[114px] w-[114px] rounded-full border-[1.5px] border-[var(--color-orb-ring-2)]" />
          <div className="absolute h-[90px] w-[90px] rounded-full border-[1.5px] border-[var(--color-orb-ring-1)]" />
          <div className="relative z-[2] flex h-16 w-16 animate-[landing-float_3s_ease-in-out_infinite] items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--color-orb-start),var(--color-orb-end))] shadow-[var(--shadow-orb)]">
            <Aperture size={28} color="var(--color-surface)" aria-hidden="true" />
          </div>
        </div>

        {/* Brand */}
        <div className="mb-1 text-center font-[var(--font-display)] text-[28px] font-bold tracking-[-0.5px] text-[var(--color-landing-brand)]">
          TeamSync
        </div>
        <div className="mb-4 text-center text-[13.5px] font-normal tracking-[0.2px] text-[var(--color-text-muted)]">
          Synchronized Collaboration
        </div>

        {/* Form */}
        <form className="w-full" onSubmit={handle}>
          <div className="mb-2.5 flex w-full items-center rounded-full border-[1.5px] border-[var(--color-landing-input-border)] bg-[var(--color-landing-input-bg)] px-[18px] py-[5px]">
            <span className="mr-2 shrink-0 text-[15px] text-[var(--color-text-placeholder)]">
              @
            </span>
            <input
              type="email"
              className="flex-1 bg-transparent py-1.5 text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)]"
              placeholder="your work email"
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
              disabled={loading}
              className="h-10 shrink-0 whitespace-nowrap rounded-full bg-[var(--color-orb-end)] px-[22px] text-[14px] font-medium text-[var(--color-surface)] transition hover:bg-[var(--color-brand-deep)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Verify"}
            </button>
          </div>

          {error && (
            <p className="mb-2.5 flex items-center gap-1.5 rounded-full border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-4 py-2 text-[13px] text-[var(--color-error)]">
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          <p className="mb-6 text-center text-[13px] text-[var(--color-text-faint)]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNext(toPrimaverseEmail(email), "login")}
              className="bg-transparent p-0 text-[inherit] font-semibold text-[var(--color-brand)] underline underline-offset-2"
            >
              Log in
            </button>
          </p>
        </form>

        {/* Status badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5">
          <span className="h-[7px] w-[7px] shrink-0 animate-[landing-blink_1.8s_ease-in-out_infinite] rounded-full bg-[var(--color-orb-end)]" />
          <span className="text-[11.5px] font-medium uppercase tracking-[1px] text-[var(--color-text-faint)]">
            Live &amp; Secure
          </span>
        </div>

      </div>
      <Footer />
    </div>
  );
}