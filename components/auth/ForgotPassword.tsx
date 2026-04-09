"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock3, Eye, EyeOff, Mail, X } from "lucide-react";
import { forgotPasswordApi } from "@/utils/auth/forgotPasswordApi";
import Footer from "@/shared/Footer";
import {
  getPasswordChecks,
  isPasswordPolicyValid,
  isPrimaverseEmail,
  sanitizePrimaverseEmailInput,
  toPrimaverseEmail,
} from "@/utils/validation/LoginValidation";

interface Props {
  onBack?: () => void;
}

export default function ForgotPassword({ onBack }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(114);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const passwordChecks = getPasswordChecks(newPassword);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const id = setInterval(() => setTimer((v) => v - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  useEffect(() => {
    if (step === "otp") inputs.current[0]?.focus();
  }, [step]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = toPrimaverseEmail(email.trim());
    if (!isPrimaverseEmail(normalizedEmail)) {
      setError("Only @primaverse.com emails are allowed.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi.forgotPassword(normalizedEmail);
      setEmail(normalizedEmail);
      setOtp(Array(6).fill(""));
      setTimer(114);
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    setError("");
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    setError("");
    setLoading(true);
    try {
      const response = await forgotPasswordApi.verifyForgotOtp(email, code);
      const token = response.data?.resetToken;
      if (!token) { setError("Could not verify OTP. Please try again."); return; }
      setResetToken(token);
      setStep("password");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi.forgotPassword(email);
      setOtp(Array(6).fill(""));
      setTimer(114);
      inputs.current[0]?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordPolicyValid(newPassword)) {
      setError("Password must be at least 8 characters and include 1 uppercase and 1 special character.");
      return;
    }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi.resetPassword(resetToken, newPassword);
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => onBack ? onBack() : router.push("/auth/login");

  // ── Shared style objects ──────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid var(--color-input-border)",
    borderRadius: "var(--radius-input)",
    background: "var(--color-input-bg)",
    fontSize: 15,
    fontFamily: "var(--font-base)",
    color: "var(--color-text-primary)",
    outline: "none",
  };

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "17px 24px",
    background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-deep))",
    color: "var(--color-surface)",
    border: "none",
    borderRadius: "var(--radius-btn)",
    fontSize: 15.5,
    fontWeight: 700,
    fontFamily: "var(--font-base)",
    cursor: "pointer",
    boxShadow: "var(--shadow-btn)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  const btnDisabledStyle: React.CSSProperties = {
    ...btnStyle,
    background: "linear-gradient(135deg, var(--color-btn-disabled-start), var(--color-btn-disabled-end))",
    boxShadow: "none",
    cursor: "not-allowed",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 13,
    color: "var(--color-error)",
    background: "var(--color-error-bg)",
    border: "1px solid var(--color-error-border)",
    borderRadius: "var(--radius-input)",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    margin: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
  };

  const linkStyle: React.CSSProperties = {
    color: "var(--color-brand)",
    fontWeight: 600,
    textDecoration: "underline",
    textUnderlineOffset: 2,
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "var(--font-base)",
    fontSize: "inherit",
    padding: 0,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 60% 10%, var(--color-bg-page-start) 0%, var(--color-bg-page-mid) 30%, #eef0f8 60%, var(--color-bg-page-end) 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-base)",
      padding: 24,
    }}>

      {/* Card */}
      <div style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-page)",
        padding: "48px 44px 40px",
        width: "100%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxShadow: "var(--shadow-card)",
      }}>

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.6px",
            marginBottom: 10,
            textAlign: "left",
          }}>
            Forgot password?
          </h1>
          <p style={{
            fontSize: 14.5,
            color: "var(--color-text-secondary)",
            textAlign: "left",
            lineHeight: 1.55,
            margin: 0,
          }}>
            {step === "email"    && "Enter your email and we will send an OTP to reset your password."}
            {step === "otp"      && `Enter the 6-digit OTP sent to ${email}.`}
            {step === "password" && "OTP verified. Set your new password."}
            {step === "done"     && "Password reset complete. You can now sign in."}
          </p>
        </div>

        {/* ── Email step ── */}
        {step === "email" && (
          <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }} onSubmit={handleSendOtp}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label style={labelStyle} htmlFor="forgotEmail">Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  id="forgotEmail"
                  type="email"
                  style={{ ...inputStyle, paddingRight: 48, ...(email ? { borderColor: "var(--color-brand-light)", background: "var(--color-surface)" } : {}) }}
                  placeholder="name@primaverse.com"
                  value={email}
                  onChange={(e) => { setEmail(sanitizePrimaverseEmailInput(e.target.value)); setError(""); }}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                />
                <span style={{ position: "absolute", right: 14, pointerEvents: "none", display: "flex", alignItems: "center", color: "var(--color-text-faint)" }}>
                  <Mail size={18} />
                </span>
              </div>
            </div>

            {error && <p style={errorStyle}><AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />{error}</p>}

            <button type="submit" style={loading || !email.trim() ? btnDisabledStyle : btnStyle} disabled={loading || !email.trim()}>
              {loading ? <><span style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "auth-spin 0.7s linear infinite", display: "inline-block" }} /> Sending...</> : <>Send OTP <ArrowRight size={18} aria-hidden="true" /></>}
            </button>
          </form>
        )}

        {/* ── OTP step ── */}
        {step === "otp" && (
          <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }} onSubmit={handleVerifyOtp}>
            <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center", marginBottom: 24 }} onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputs.current[index] = el; }}
                  style={{
                    width: 52,
                    height: 58,
                    border: `1.5px solid ${digit ? "var(--color-brand-light)" : "var(--color-input-border)"}`,
                    borderRadius: "var(--radius-input)",
                    background: digit ? "var(--color-surface)" : "var(--color-input-bg)",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-base)",
                    outline: "none",
                    caretColor: "var(--color-brand)",
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--color-text-secondary)", justifyContent: "center", marginBottom: 12, margin: 0 }}>
              <Clock3 size={16} color="var(--color-brand)" aria-hidden="true" />
              Resend code in <span style={{ color: "var(--color-brand-deep)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{formatTime(timer)}</span>
            </p>

            {timer === 0 && (
              <button type="button" style={linkStyle} onClick={handleResendOtp} disabled={loading}>
                Resend OTP
              </button>
            )}

            {error && <p style={errorStyle}><AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />{error}</p>}

            <button type="submit" style={loading || otp.join("").length !== 6 ? btnDisabledStyle : btnStyle} disabled={loading || otp.join("").length !== 6}>
              {loading ? <><span style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "auth-spin 0.7s linear infinite", display: "inline-block" }} /> Verifying...</> : <>Verify OTP <ArrowRight size={18} aria-hidden="true" /></>}
            </button>
          </form>
        )}

        {/* ── Password step ── */}
        {step === "password" && (
          <form style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }} onSubmit={handleResetPassword}>
            {[
              { id: "newPassword", label: "New Password", value: newPassword, show: showNewPassword, toggle: () => setShowNewPassword(v => !v), onChange: (v: string) => { setNewPassword(v); setError(""); }, placeholder: "Enter Password" },
              { id: "confirmPassword", label: "Confirm Password", value: confirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v), onChange: (v: string) => { setConfirmPassword(v); setError(""); }, placeholder: "Retype Password" },
            ].map((field) => (
              <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={labelStyle} htmlFor={field.id}>{field.label}</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    id={field.id}
                    type={field.show ? "text" : "password"}
                    style={{ ...inputStyle, paddingRight: 48, ...(field.value ? { borderColor: "var(--color-brand-light)", background: "var(--color-surface)" } : {}) }}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={field.toggle} tabIndex={-1} style={{ position: "absolute", right: 14, background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "var(--color-text-faint)" }}>
                    {field.show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            ))}

            {newPassword && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10, marginBottom: 12 }}>
                {[
                  { met: passwordChecks.hasMinLength, label: "Min 8 characters" },
                  { met: passwordChecks.hasUppercase, label: "One uppercase letter" },
                  { met: passwordChecks.hasSpecial,   label: "One special character" },
                ].map(({ met, label }) => (
                  <span key={label} style={{ fontSize: 12, color: met ? "var(--color-success)" : "var(--color-text-muted)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    {met ? <Check size={12} /> : <X size={12} />} {label}
                  </span>
                ))}
              </div>
            )}

            {error && <p style={errorStyle}><AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />{error}</p>}

            <button type="submit" style={loading || !newPassword || !confirmPassword ? btnDisabledStyle : btnStyle} disabled={loading || !newPassword || !confirmPassword}>
              {loading ? <><span style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "auth-spin 0.7s linear infinite", display: "inline-block" }} /> Updating...</> : <>Reset Password <ArrowRight size={18} aria-hidden="true" /></>}
            </button>
          </form>
        )}

        {/* ── Done step ── */}
        {step === "done" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ marginTop: 28, fontSize: 11, fontWeight: 600, letterSpacing: 0.9, color: "var(--color-text-faint)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, margin: 0 }}>
              Your password has been reset successfully.
            </p>
            <button type="button" style={btnStyle} onClick={goBack}>
              Back to Login <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* ── Divider + back link ── */}
        {step !== "done" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0", width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-faint)", whiteSpace: "nowrap" }}>
                Remembered your password?
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
            </div>

            <p style={{ fontSize: 12.5, color: "var(--color-text-muted)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, width: "100%", margin: 0 }}>
              <button type="button" style={linkStyle} onClick={goBack}>
                <ArrowLeft size={15} aria-hidden="true" style={{ marginRight: 4 }} />
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>

      {/* ── Social proof ── */}
      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {[
            "linear-gradient(135deg, var(--color-auth-av-1-start), var(--color-brand))",
            "linear-gradient(135deg, var(--color-auth-av-2-start), var(--color-auth-av-2-end))",
            "linear-gradient(135deg, var(--color-auth-av-3-start), var(--color-auth-av-3-end))",
          ].map((bg, i) => (
            <div key={i} style={{
              width: 30, height: 30, borderRadius: "50%",
              border: "2px solid var(--color-surface)",
              marginLeft: i === 0 ? 0 : -8,
              background: bg,
            }} />
          ))}
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "2px solid var(--color-surface)",
            marginLeft: -8,
            background: "var(--color-brand-xsubtle)",
            color: "var(--color-brand)",
            fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-base)",
          }}>
            +12
          </div>
        </div>
        <span style={{ fontSize: 12.5, color: "var(--color-text-muted)", fontWeight: 500 }}>
          Collaborating in TeamSync today
        </span>
      </div>

      <Footer />
    </div>
  );
}