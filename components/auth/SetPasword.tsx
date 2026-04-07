"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { ArrowRight, Eye, EyeOff, Info, Lock } from "lucide-react";

export default function SetPasword() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const checks = useMemo(() => {
		const hasMinLength = newPassword.length >= 8;
		const hasUppercase = /[A-Z]/.test(newPassword);
		const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);

		return {
			hasMinLength,
			hasUppercase,
			hasSymbol,
			score: Number(hasMinLength) + Number(hasUppercase) + Number(hasSymbol),
		};
	}, [newPassword]);

	const strengthLabel = checks.score === 3 ? "Optimal" : checks.score === 2 ? "Good" : checks.score === 1 ? "Weak" : "None";

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (checks.score < 3) {
			alert("Use at least 8 characters, 1 uppercase letter, and 1 symbol.");
			return;
		}

		if (newPassword !== confirmPassword) {
			alert("Passwords do not match.");
			return;
		}

		alert("Password setup complete.");
	};

	return (
		<div className="sp-root">
			<main className="sp-main">
				<section className="sp-card" aria-label="Set password form">
					<div className="sp-lock-badge" aria-hidden="true">
						<Lock size={18} aria-hidden="true" />
					</div>

					<header className="sp-header">
						<h1 className="sp-title">Secure Your Account</h1>
						<p className="sp-subtitle">Choose a sophisticated password to protect your digital workspace.</p>
					</header>

					<form className="sp-form" onSubmit={handleSubmit}>
						<label className="sp-label" htmlFor="newPassword">New Password</label>
						<div className="sp-input-wrap">
							<input
								id="newPassword"
								className="sp-input"
								type={showNewPassword ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Enter your new password"
								autoComplete="new-password"
								required
							/>
							<button
								type="button"
								className="sp-icon-btn"
								aria-label={showNewPassword ? "Hide password" : "Show password"}
								onClick={() => setShowNewPassword((v) => !v)}
							>
								{showNewPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
							</button>
						</div>

						<div className="sp-strength-row" aria-live="polite">
							<span className="sp-strength-text">Strength: {strengthLabel}</span>
							<span className="sp-strength-dots">
								<span className={`sp-dot ${checks.score > 0 ? "sp-dot-on" : ""}`} />
								<span className={`sp-dot ${checks.score > 1 ? "sp-dot-on" : ""}`} />
								<span className={`sp-dot ${checks.score > 2 ? "sp-dot-on" : ""}`} />
								<span className="sp-dot" />
							</span>
						</div>

						<div className="sp-strength-bar" role="progressbar" aria-valuenow={checks.score} aria-valuemin={0} aria-valuemax={3}>
							<span className="sp-strength-fill" style={{ width: `${(checks.score / 3) * 100}%` }} />
						</div>

						<label className="sp-label" htmlFor="confirmPassword">Confirm Password</label>
						<div className="sp-input-wrap">
							<input
								id="confirmPassword"
								className="sp-input"
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Retype the Password"
								autoComplete="new-password"
								required
							/>
							<button
								type="button"
								className="sp-icon-btn"
								aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
								onClick={() => setShowConfirmPassword((v) => !v)}
							>
								{showConfirmPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
							</button>
						</div>

						<button className="sp-submit" type="submit">
							<span>Complete Setup</span>
							<ArrowRight size={18} aria-hidden="true" />
						</button>
					</form>

					<p className="sp-hint">
						<Info size={12} aria-hidden="true" />
						<span>Min 8 characters, 1 uppercase, 1 symbol</span>
					</p>
					<a href="#" className="sp-help">Need assistance?</a>
				</section>
			</main>

			<footer className="sp-footer">© 2026 TeamSync Digital Atelier. All rights reserved.</footer>
		</div>
	);
}
