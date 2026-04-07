"use client";
import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("otp");
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/auth/set-password");
  };

  return (
    <div className="ts-root">

      {/* NAV */}
      <nav className="ts-nav">
        <span className="ts-nav-brand">TeamSync</span>
        <div className="ts-nav-actions">
          <button className="ts-icon-btn" title="Help">?</button>
          <button className="ts-icon-btn" title="Info">i</button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="ts-main">

        {step === "email" ? (
          <div className="ts-step">
            {/* Orb */}
            <div className="ts-orb-wrap">
              <span className="ts-orb-ring ts-ring-3" />
              <span className="ts-orb-ring ts-ring-2" />
              <span className="ts-orb-ring ts-ring-1" />
              <div className="ts-orb">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="ts-heading">
              <h1 className="ts-title">Welcome back.</h1>
              <p className="ts-subtitle">Enter your details to access your workspace.</p>
            </div>

            {/* Form */}
            <form className="ts-form" onSubmit={handleSendOtp}>
              <div className="ts-input-wrap">
                <span className="ts-input-icon">✉</span>
                <input
                  className="ts-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <button className="ts-btn" type="submit" disabled={loading}>
                  {loading && <span className="ts-spinner" />}
                  {loading ? "Sending…" : "Send Code"}
                </button>
              </div>

              <p className="ts-login-hint">
                Don&apos;t have an account?{" "}
                <a href="/register" className="ts-link">Join now</a>
              </p>
            </form>

            {/* Badge */}
            <div className="ts-badge">
              <div className="ts-badge-dots">
                <span className="ts-dot ts-dot--on" />
                <span className="ts-dot ts-dot--on" />
                <span className="ts-dot ts-dot--off" />
                <span className="ts-dot ts-dot--off" />
              </div>
              <span className="ts-badge-text">14 online now</span>
            </div>
          </div>
        ) : (
          <div className="ts-step">
            {/* Heading */}
            <div className="ts-heading">
              <h1 className="ts-title">Check your email.</h1>
              <p className="ts-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>

            {/* OTP Form */}
            <form className="ts-form" onSubmit={handleVerify}>
              <div className="ts-otp-row">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    className="ts-otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <p className="ts-otp-hint">
                Didn&apos;t receive it?{" "}
                <button type="button" className="ts-otp-resend">Resend code</button>
              </p>

              <button
                className="ts-btn ts-btn--full"
                type="submit"
                disabled={loading || otp.join("").length < 6}
              >
                {loading && <span className="ts-spinner" />}
                {loading ? "Verifying…" : "Verify & Sign In"}
              </button>

              <button type="button" className="ts-back-btn" onClick={() => setStep("email")}>
                ← Back
              </button>
            </form>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="ts-footer">
        <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
        <div className="ts-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>

    </div>
  );
}