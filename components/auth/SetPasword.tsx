"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { ArrowRight, Eye, EyeOff, Info, Lock } from "lucide-react";

export default function SetPassword() {
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

	const strengthLabel =
		checks.score === 3 ? "Optimal" :
			checks.score === 2 ? "Good" :
				checks.score === 1 ? "Weak" : "None";

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
		<div className="min-h-screen flex flex-col font-[var(--font-base)] bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-bg-page-end)_100%)]">

			<main className="flex-1 flex items-center justify-center p-6">
				<section
					aria-label="Set password form"
					className="bg-[var(--color-surface)] rounded-[28px] px-11 pt-12 pb-10 w-full max-w-[420px] flex flex-col items-center shadow-[var(--shadow-card)]"
				>

					{/* Lock badge */}
					<div
						aria-hidden="true"
						className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-6 flex-shrink-0 text-[var(--color-brand)] bg-[linear-gradient(145deg,var(--color-brand-xsubtle),var(--color-brand-subtle))] shadow-[var(--shadow-shield)]"
					>
						<Lock size={18} />
					</div>

					{/* Heading */}
					<h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-[-0.5px] mb-2.5 text-center">
						Secure Your Account
					</h1>
					<p className="text-[14.5px] text-[var(--color-text-secondary)] text-center leading-[1.55] mb-8">
						Choose a sophisticated password to protect your digital workspace.
					</p>

					<form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5 mb-5">

						{/* New Password */}
						<label
							htmlFor="newPassword"
							className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase mt-2.5"
						>
							New Password
						</label>
						<div className="relative flex items-center">
							<input
								id="newPassword"
								type={showNewPassword ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Enter your new password"
								autoComplete="new-password"
								required
								className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[12px] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none font-[var(--font-base)] placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)] transition-all duration-[180ms]"
							/>
							<button
								type="button"
								aria-label={showNewPassword ? "Hide password" : "Show password"}
								onClick={() => setShowNewPassword((v) => !v)}
								className="absolute right-3.5 bg-transparent border-none cursor-pointer p-1 flex items-center text-[var(--color-text-faint)] hover:text-[var(--color-brand)] transition-colors duration-150"
							>
								{showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>

						{/* Strength row */}
						<div className="flex items-center justify-between mt-1" aria-live="polite">
							<span className="text-[11px] font-bold tracking-[0.8px] uppercase text-[var(--color-text-muted)]">
								Strength: {strengthLabel}
							</span>
							<span className="flex gap-1.5">
								{[0, 1, 2, 3].map((i) => (
									<span
										key={i}
										className={`w-2 h-2 rounded-full transition-all duration-[250ms] ${checks.score > i ? "bg-[var(--color-brand)]" : "bg-[var(--color-divider)]"}`}
									/>
								))}
							</span>
						</div>

						{/* Strength bar */}
						<div className="h-1 bg-[var(--color-divider)] rounded-full overflow-hidden mt-1">
							<span
								className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-brand-light),var(--color-brand-deep))] transition-all duration-300"
								style={{ width: `${(checks.score / 3) * 100}%` }}
							/>
						</div>

						{/* Confirm Password */}
						<label
							htmlFor="confirmPassword"
							className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase mt-2.5"
						>
							Confirm Password
						</label>
						<div className="relative flex items-center">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Retype the password"
								autoComplete="new-password"
								required
								className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[12px] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none font-[var(--font-base)] placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)] transition-all duration-[180ms]"
							/>
							<button
								type="button"
								aria-label={showConfirmPassword ? "Hide confirmation" : "Show confirmation"}
								onClick={() => setShowConfirmPassword((v) => !v)}
								className="absolute right-3.5 bg-transparent border-none cursor-pointer p-1 flex items-center text-[var(--color-text-faint)] hover:text-[var(--color-brand)] transition-colors duration-150"
							>
								{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>

						{/* Submit */}
						<button
							type="submit"
							className="w-full mt-2.5 py-[17px] px-6 rounded-[14px] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200"
						>
							<span>Complete Setup</span>
							<ArrowRight size={18} />
						</button>

					</form>

					{/* Hint */}
					<p className="text-[12px] text-[var(--color-text-muted)] flex items-center gap-1.5 mt-1">
						<Info size={12} />
						<span>Min 8 characters, 1 uppercase, 1 symbol</span>
					</p>

					{/* Help */}
					<a
						href="#"
						className="text-[12.5px] text-[var(--color-brand)] font-semibold underline underline-offset-2 mt-3 hover:opacity-75 transition-opacity duration-150"
					>
						Need assistance?
					</a>

				</section>
			</main>

			<footer className="py-5 px-6 text-center text-[12px] text-[var(--color-text-faint)] font-[var(--font-base)]">
				© 2026 TeamSync Digital Atelier. All rights reserved.
			</footer>

		</div>
	);
}