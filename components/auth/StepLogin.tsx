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
    <div className="auth-page">
      <div className="auth-card" style={{ alignItems: "flex-start" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="auth-title auth-title--left">Welcome back.</h1>
          <p className="auth-sub auth-sub--left">Enter your details to access your atelier.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className={`auth-input${mail ? " has-value" : ""}`}
              placeholder="name@primaverse.com"
              value={mail}
              onChange={(e) => { setMail(sanitizePrimaverseEmailInput(e.target.value)); setError(""); }}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-field-row">
              <label className="auth-label">Password</label>
              <button
                type="button"
                className="auth-forgot"
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
            <div className="auth-pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                className={`auth-input${pw ? " has-value" : ""}`}
                placeholder="Enter Password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                required
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              <AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !mail || !pw}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <><div className="auth-spinner" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={18} aria-hidden="true" /></>
            )}
          </button>
          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-txt">Don&apos;t have an account?</span>
            <div className="auth-divider-line" />
          </div>

          <p className="auth-hint">
            <button type="button" className="auth-link" onClick={onBack}>
              Join TeamSync now
            </button>
          </p>

        </form>
      </div>

      {/* Social proof */}
      <div className="auth-social">
        <div className="auth-avatars">
          <div className="auth-av auth-av-1" />
          <div className="auth-av auth-av-2" />
          <div className="auth-av auth-av-3" />
          <div className="auth-av-count">+12</div>
        </div>
        <span className="auth-social-txt">Collaborating in TeamSync today</span>
      </div>

      <Footer />
    </div>
  );
}