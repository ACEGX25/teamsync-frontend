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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Sora:wght@600;700&display=swap');

        .ts-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          background: #ededf7;
          font-family: 'DM Sans', sans-serif;
        }

        .ts-card {
          background: #fff;
          border-radius: 24px;
          padding: 2.5rem 2rem 2rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 8px 40px rgba(120,100,220,0.10), 0 2px 8px rgba(120,100,220,0.06);
          border: 1px solid rgba(180,170,230,0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ts-orb-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .ts-orb-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(150,120,230,0.18);
        }
        .ts-ring-1 { width: 90px;  height: 90px; }
        .ts-ring-2 { width: 114px; height: 114px; border-color: rgba(150,120,230,0.11); }
        .ts-ring-3 { width: 138px; height: 138px; border-color: rgba(150,120,230,0.07); }

        .ts-orb {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(145deg, #8b5cf6, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          box-shadow: 0 4px 24px rgba(124,58,237,0.35);
          animation: ts-float 3s ease-in-out infinite;
        }

        @keyframes ts-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }

        .ts-brand-name {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a1235;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
          text-align: center;
        }

        .ts-brand-tagline {
          font-size: 13.5px;
          color: #9490b0;
          font-weight: 400;
          text-align: center;
          margin-bottom: 1.75rem;
          letter-spacing: 0.2px;
        }

        .ts-input-row {
          display: flex;
          align-items: center;
          width: 100%;
          background: #f5f4fc;
          border: 1.5px solid #e0ddf3;
          border-radius: 999px;
          padding: 5px 5px 5px 18px;
          margin-bottom: 10px;
          transition: border-color 0.2s;
        }

        .ts-input-row:focus-within {
          border-color: #8b5cf6;
        }

        .ts-input-icon {
          font-size: 15px;
          color: #b0abc8;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .ts-input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #2d2650;
          font-family: 'DM Sans', sans-serif;
          padding: 6px 0;
        }

        .ts-input-field::placeholder { color: #c0bbda; }

        .ts-btn-login {
          height: 40px;
          padding: 0 22px;
          background: #7c3aed;
          border: none;
          border-radius: 999px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ts-btn-login:hover  { background: #6d28d9; }
        .ts-btn-login:active { transform: scale(0.97); }

        .ts-hint-row {
          font-size: 13px;
          color: #a09bbf;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .ts-link-btn {
          background: none;
          border: none;
          color: #7c3aed;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .ts-link-btn:hover { color: #5b21b6; }

        .ts-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
        }

        .ts-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ts-dot--off { background: #d4d0e8; }

        .ts-dot--on {
          background: #7c3aed;
          animation: ts-blink 1.8s ease-in-out infinite;
        }

        @keyframes ts-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        .ts-badge-text {
          font-size: 11.5px;
          font-weight: 500;
          color: #b0abc8;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="ts-page">
        <div className="ts-card">

          {/* Orb */}
          <div className="ts-orb-wrap">
            <div className="ts-orb-ring ts-ring-3" />
            <div className="ts-orb-ring ts-ring-2" />
            <div className="ts-orb-ring ts-ring-1" />
            <div className="ts-orb">
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

          {/* Heading */}
          <div className="ts-brand-name">TeamSync</div>
          <div className="ts-brand-tagline">Synchronized Collaboration</div>

          {/* Form */}
          <form style={{ width: "100%" }} onSubmit={handle}>
            <div className="ts-input-row">
              <span className="ts-input-icon">@</span>
              <input
                type="email"
                className="ts-input-field"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="ts-btn-login">Verify</button>
            </div>

            <p className="ts-hint-row">
              Already have an account?{" "}
              <button
                type="button"
                className="ts-link-btn"
                onClick={() => onNext(email, "login")}
              >
                Log in
              </button>
            </p>
          </form>

          {/* Badge */}

        </div>
      </div>
    </>
  );
}   