"use client";

import { useMemo, useState } from "react";
import type React from "react";

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
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path
								d="M17 10h-1V8a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V8Z"
								fill="currentColor"
							/>
						</svg>
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
								<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
									<circle cx="12" cy="12" r="2.8" />
								</svg>
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
								placeholder=""
								autoComplete="new-password"
								required
							/>
							<button
								type="button"
								className="sp-icon-btn"
								aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
								onClick={() => setShowConfirmPassword((v) => !v)}
							>
								<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
									<path d="M3 12a9 9 0 1 0 3-6.7" />
									<path d="M3 4v5h5" />
								</svg>
							</button>
						</div>

						<button className="sp-submit" type="submit">
							<span>Complete Setup</span>
							<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
								<path d="M5 12h14" />
								<path d="m13 5 7 7-7 7" />
							</svg>
						</button>
					</form>

					<p className="sp-hint">
						<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="9" />
							<path d="M12 11v5" />
							<path d="M12 8h.01" />
						</svg>
						<span>Min 8 characters, 1 uppercase, 1 symbol</span>
					</p>
					<a href="#" className="sp-help">Need assistance?</a>
				</section>
			</main>

			<footer className="sp-footer">© 2024 TeamSync Digital Atelier. All rights reserved.</footer>
		</div>
	);
}
