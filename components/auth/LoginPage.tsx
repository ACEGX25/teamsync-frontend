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
    <div className="auth-page">

      {/* STEP: EMAIL */}
      {step === "email" ? (
        <div className="auth-card">

          {/* Orb */}
          <div className="landing-orb-wrap">
            <span className="landing-orb-ring landing-ring-3" />
            <span className="landing-orb-ring landing-ring-2" />
            <span className="landing-orb-ring landing-ring-1" />
            <div className="landing-orb">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="auth-title">Welcome back.</h1>
          <p className="auth-sub">Enter your details to access your workspace.</p>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail((e.target.value ?? "").toLowerCase())}
                required
                autoFocus
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading && <span className="auth-spinner" />}
              {loading ? "Sending…" : "Send Code →"}
            </button>

            <p className="auth-hint">
              Don&apos;t have an account?{" "}
              <a href="/register" className="auth-link">Join now</a>
            </p>

            {/* Badge */}
            <div className="landing-badge">
              <span className="landing-dot landing-dot--on" />
              <span className="landing-badge-text">14 online now</span>
            </div>
          </form>
        </div>

      ) : (

        /* STEP: OTP */
        <div className="auth-card">
          <div className="auth-shield">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="var(--color-brand)" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="auth-title">Check your email.</h1>
          <p className="auth-sub">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>

          <form className="auth-form" onSubmit={handleVerify}>
            <div className="auth-otp-row">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  className={`auth-otp-box${digit ? " filled" : ""}`}
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

            <p className="auth-hint">
              Didn&apos;t receive it?{" "}
              <button type="button" className="auth-link">Resend code</button>
            </p>

            <button
              className="auth-btn"
              type="submit"
              disabled={loading || otp.join("").length < 6}
            >
              {loading && <span className="auth-spinner" />}
              {loading ? "Verifying…" : "Verify & Sign In →"}
            </button>

            <button
              type="button"
              className="auth-link"
              style={{ textAlign: "center" }}
              onClick={() => setStep("email")}
            >
              ← Back
            </button>
          </form>
        </div>
      )}

      {/* FOOTER */}
      <footer className="auth-footer">
        <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
        <div className="auth-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>

    </div>
  );
}