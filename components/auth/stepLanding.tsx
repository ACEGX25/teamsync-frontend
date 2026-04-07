"use client";

import { useState } from "react";
import { authApi } from "@/utils/api";

type Step = "landing" | "verify" | "secure" | "login";

interface Props {
  onNext: (email: string, step?: Step) => void;
}

export default function StepLanding({ onNext }: Props) {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.initiateRegister(email);
      onNext(email);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--landing">
      <div className="auth-card auth-card--landing">

        {/* Floating orb */}
        <div className="landing-orb-wrap">
          <div className="landing-orb-ring landing-ring-3" />
          <div className="landing-orb-ring landing-ring-2" />
          <div className="landing-orb-ring landing-ring-1" />
          <div className="landing-orb">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path d="M18 8c-3 0-5.5 1.3-7.3 3.3" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M10 18a8 8 0 0 0 8 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
              <path d="M18 28c3 0 5.5-1.3 7.3-3.3" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M26 18a8 8 0 0 0-8-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
              <circle cx="18" cy="18" r="3" fill="white" />
            </svg>
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
              placeholder="Your Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
            />
            <button type="submit" className="landing-btn-verify" disabled={loading}>
              {loading ? "Sending..." : "Verify"}
            </button>
          </div>

          {error && (
            <p className="auth-error" style={{ marginBottom: 10, borderRadius: 999 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--color-error)">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}

          <p className="landing-hint-row">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => onNext(email, "login")}
            >
              Log in
            </button>
          </p>
        </form>

        {/* Status badge */}
        <div className="landing-badge">
          <span className="landing-dot landing-dot--on" />
          <span className="landing-badge-text">Live &amp; Secure</span>
        </div>

      </div>
    </div>
  );
}