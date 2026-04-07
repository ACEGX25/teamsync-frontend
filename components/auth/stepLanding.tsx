"use client";

import { useState } from "react";
import { Aperture } from "lucide-react";

type Step = "landing" | "verify" | "secure" | "login";

interface Props {
  onNext: (email: string, step?: Step) => void;
}

export default function StepLanding({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@primaverse.com")) {
      setError("Only @primaverse.com email addresses are allowed.")
      return;
    }
    setError("")
    onNext(email);
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
              placeholder="Your Email"
              value={email}
              onChange={(e) => { setEmail((e.target.value ?? "").toLowerCase()); setError(""); }}
              required
            />
            <button type="submit" className="landing-btn-verify">Verify</button>
          </div>

          {/* ← ADD HERE */}
          {error && <p className="landing-error">{error}</p>}

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

        {/* Live status badge */}
        <div className="landing-badge">
          <span className="landing-dot landing-dot--on" />
          <span className="landing-badge-text">Live &amp; Secure</span>
        </div>

      </div>
    </div>
  );
}