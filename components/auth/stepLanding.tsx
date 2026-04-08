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
    <div className="auth-page auth-page--landing">
      <div className="auth-card auth-card--landing">

        {/* Floating orb with concentric rings */}
        <div className="landing-orb-wrap">
          <div className="landing-orb-ring landing-ring-3" />
          <div className="landing-orb-ring landing-ring-2" />
          <div className="landing-orb-ring landing-ring-1" />
          <div className="landing-orb">
            <Aperture size={28} color="white" aria-hidden="true" />
          </div>
        </div>

        {/* Brand */}
        <div className="landing-brand-name">TeamSync</div>
        <div className="landing-tagline">Synchronized Collaboration</div>

        {/* Form */}
        <form style={{ width: "100%" }} onSubmit={handle}>
          <div className="landing-input-row">
            <span className="landing-input-icon">@</span>
            <input
              type="email"
              className="landing-input-field"
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
              className="landing-btn-verify"
              disabled={loading}
            >
              {loading ? "Sending..." : "Verify"}
            </button>
          </div>

          {error && (
            <p className="auth-error" style={{ marginBottom: 10, borderRadius: 999 }}>
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          <p className="landing-hint-row">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => onNext(toPrimaverseEmail(email), "login")}
            >
              Log in
            </button>
          </p>
        </form>

        {/* Live status badge */}
        <div className="landing-badge">
          <span className="landing-dot landing-dot--on" />
          <span className="landing-badge-text">Live &amp; Secure</span>
        </div>

      </div>
    </div>
  );
}