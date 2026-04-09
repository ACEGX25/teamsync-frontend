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
    <div style={{
      minHeight: "100vh",
      background: "var(--color-landing-bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-base)",
      padding: 24,
    }}>
      <div style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-page)",
        padding: "40px 32px 32px",
        width: "100%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid var(--color-landing-card-border)",
        boxShadow: "var(--shadow-landing-card)",
      }}>

        {/* Orb */}
        <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          {/* Rings */}
          {[
            { size: 138, color: "var(--color-orb-ring-3)" },
            { size: 114, color: "var(--color-orb-ring-2)" },
            { size: 90,  color: "var(--color-orb-ring-1)" },
          ].map(({ size, color }) => (
            <div key={size} style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1.5px solid ${color}`,
            }} />
          ))}
          {/* Orb */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(145deg, var(--color-orb-start), var(--color-orb-end))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
            boxShadow: "var(--shadow-orb)",
            animation: "landing-float 3s ease-in-out infinite",
          }}>
            <Aperture size={28} color="white" aria-hidden="true" />
          </div>
        </div>

        {/* Brand */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 700,
          color: "var(--color-landing-brand)",
          letterSpacing: "-0.5px",
          marginBottom: 4,
          textAlign: "center",
        }}>
          TeamSync
        </div>
        <div style={{
          fontSize: 13.5,
          color: "var(--color-text-muted)",
          fontWeight: 400,
          textAlign: "center",
          marginBottom: 16,
          letterSpacing: 0.2,
        }}>
          Synchronized Collaboration
        </div>

        {/* Form */}
        <form style={{ width: "100%" }} onSubmit={handle}>
          <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            background: "var(--color-landing-input-bg)",
            border: "1.5px solid var(--color-landing-input-border)",
            borderRadius: 999,
            padding: "5px 5px 5px 18px",
            marginBottom: 10,
            transition: "border-color 0.2s",
          }}>
            <span style={{ fontSize: 15, color: "var(--color-text-placeholder)", marginRight: 8, flexShrink: 0 }}>
              @
            </span>
            <input
              type="email"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-base)",
                padding: "6px 0",
              }}
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
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-brand-deep)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--color-orb-end)")}
              style={{
                height: 40,
                padding: "0 22px",
                background: "var(--color-orb-end)",
                border: "none",
                borderRadius: 999,
                color: "var(--color-surface)",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "var(--font-base)",
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "background 0.2s, transform 0.15s",
              }}
            >
              {loading ? "Sending..." : "Verify"}
            </button>
          </div>

          {error && (
            <p style={{
              fontSize: 13,
              color: "var(--color-error)",
              background: "var(--color-error-bg)",
              border: "1px solid var(--color-error-border)",
              borderRadius: 999,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
              margin: "0 0 10px",
            }}>
              <AlertCircle size={14} color="var(--color-error)" aria-hidden="true" />
              {error}
            </p>
          )}

          <p style={{ fontSize: 13, color: "var(--color-text-faint)", marginBottom: 24, textAlign: "center", margin: "0 0 24px" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNext(toPrimaverseEmail(email), "login")}
              style={{
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
              }}
            >
              Log in
            </button>
          </p>
        </form>

        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 14px" }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            flexShrink: 0,
            background: "var(--color-orb-end)",
            animation: "landing-blink 1.8s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--color-text-faint)",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}>
            Live &amp; Secure
          </span>
        </div>

      </div>
      <Footer />
    </div>
  );
}