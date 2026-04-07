"use client";

import { useState } from "react";

type Step = "landing" | "verify" | "secure" | "login";

interface Props {
  onNext: (email: string, step?: Step) => void;
}

export default function StepLanding({ onNext }: Props) {
  const [email, setEmail] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
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
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 8c-3 0-5.5 1.3-7.3 3.3"
                stroke="white" strokeWidth="2.2" strokeLinecap="round"
              />
              <path
                d="M10 18a8 8 0 0 0 8 8"
                stroke="white" strokeWidth="2.2" strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M18 28c3 0 5.5-1.3 7.3-3.3"
                stroke="white" strokeWidth="2.2" strokeLinecap="round"
              />
              <path
                d="M26 18a8 8 0 0 0-8-8"
                stroke="white" strokeWidth="2.2" strokeLinecap="round"
                opacity="0.5"
              />
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="landing-btn-verify">Verify</button>
          </div>

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