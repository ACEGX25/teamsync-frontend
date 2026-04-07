"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock3, Eye, EyeOff, Mail, X } from "lucide-react";
import { authApi } from "@/utils/api";

const PRIMAVERSE_EMAIL_REGEX = /^[a-z]+@primaverse\.com$/;

function sanitizePrimaverseEmailInput(raw: string): string {
	const lowered = raw.toLowerCase();
	const [localPart = "", ...rest] = lowered.split("@");
	const cleanLocalPart = localPart.replace(/[^a-z]/g, "");
	if (rest.length === 0) return cleanLocalPart;
	const cleanDomain = rest.join("@").replace(/[^a-z.]/g, "");
	return `${cleanLocalPart}@${cleanDomain}`;
}

function toPrimaverseEmail(raw: string): string {
	const sanitized = sanitizePrimaverseEmailInput(raw);
	const [localPart = "", domain] = sanitized.split("@");
	if (!localPart) return "";
	return `${localPart}@${domain || "primaverse.com"}`;
}

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

	useEffect(() => {
		if (step !== "otp" || timer <= 0) return;
		const id = setInterval(() => setTimer((v) => v - 1), 1000);
		return () => clearInterval(id);
	}, [step, timer]);

	const formatTime = (seconds: number) =>
		`${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
			.toString()
			.padStart(2, "0")}`;

	const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const normalizedEmail = toPrimaverseEmail(email.trim());
		if (!PRIMAVERSE_EMAIL_REGEX.test(normalizedEmail)) {
			setError("Only @primaverse.com emails are allowed.");
			return;
		}
		setError("");
		setLoading(true);
		try {
			await authApi.forgotPassword(normalizedEmail);
			setEmail(normalizedEmail);
			setOtp(Array(6).fill(""));
			setTimer(114);
			setStep("otp");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Failed to send OTP.");
			}
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
		if (value && index < 5) {
			inputs.current[index + 1]?.focus();
		}
	};

	const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputs.current[index - 1]?.focus();
		}
	};

	const handleOtpPaste = (e: React.ClipboardEvent) => {
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		if (!pasted) return;
		e.preventDefault();
		const next = [...otp];
		pasted.split("").forEach((char, index) => {
			next[index] = char;
		});
		setOtp(next);
		setError("");
		inputs.current[Math.min(pasted.length, 5)]?.focus();
	};

	const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const code = otp.join("");
		if (code.length !== 6) {
			setError("Please enter the 6-digit OTP.");
			return;
		}

		setError("");
		setLoading(true);
		try {
			const response = await authApi.verifyForgotOtp(email, code);
			const token = response.data?.resetToken;
			if (!token) {
				setError("Could not verify OTP. Please try again.");
				return;
			}
			setResetToken(token);
			setStep("password");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("OTP verification failed.");
			}
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
			await authApi.forgotPassword(email);
			setOtp(Array(6).fill(""));
			setTimer(114);
			inputs.current[0]?.focus();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Failed to resend OTP.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const hasMinLength = newPassword.length >= 8;
		const hasUppercase = /[A-Z]/.test(newPassword);
		const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);

		if (!hasMinLength || !hasUppercase || !hasSpecial) {
			setError("Password must be at least 8 characters and include 1 uppercase and 1 special character.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setError("");
		setLoading(true);
		try {
			await authApi.resetPassword(resetToken, newPassword);
			setStep("done");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Failed to reset password.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card" style={{ alignItems: "flex-start" }}>
				<div style={{ marginBottom: 28 }}>
					<h1 className="auth-title auth-title--left">Forgot password?</h1>
					<p className="auth-sub auth-sub--left">
						{step === "email" && "Enter your email and we will send an OTP to reset your password."}
						{step === "otp" && `Enter the 6-digit OTP sent to ${email}.`}
						{step === "password" && "OTP verified. Set your new password."}
						{step === "done" && "Password reset complete. You can now sign in."}
					</p>
				</div>

				{step === "email" && (
					<form className="auth-form" onSubmit={handleSendOtp}>
						<div className="auth-field">
							<label className="auth-label" htmlFor="forgotEmail">Email Address</label>
							<div className="auth-pw-wrap">
								<input
									id="forgotEmail"
									type="email"
									className={`auth-input${email ? " has-value" : ""}`}
									placeholder="name@primaverse.com"
									value={email}
									onChange={(e) => {
										setEmail(sanitizePrimaverseEmailInput(e.target.value));
										setError("");
									}}
									autoCapitalize="none"
									autoCorrect="off"
									spellCheck={false}
									required
								/>
								<span className="auth-eye" aria-hidden="true" style={{ pointerEvents: "none" }}>
									<Mail size={18} />
								</span>
							</div>
						</div>

						{error && (
							<p className="auth-error">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button type="submit" className="auth-btn" disabled={loading || !email.trim()}>
							{loading ? (
								<><div className="auth-spinner" /> Sending...</>
							) : (
								<>Send OTP <ArrowRight size={18} aria-hidden="true" /></>
							)}
						</button>
					</form>
				)}

				{step === "otp" && (
					<form className="auth-form" onSubmit={handleVerifyOtp}>
						<div className="auth-otp-row" onPaste={handleOtpPaste}>
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={(el) => {
										inputs.current[index] = el;
									}}
									className={`auth-otp-box${digit ? " filled" : ""}`}
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

						<p className="auth-timer-row" style={{ marginBottom: 12 }}>
							<Clock3 className="auth-timer-icon" size={16} aria-hidden="true" />
							Resend code in <span className="auth-timer-val">{formatTime(timer)}</span>
						</p>

						{timer === 0 && (
							<button type="button" className="auth-link" onClick={handleResendOtp} disabled={loading}>
								Resend OTP
							</button>
						)}

						{error && (
							<p className="auth-error">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button type="submit" className="auth-btn" disabled={loading || otp.join("").length !== 6}>
							{loading ? (
								<><div className="auth-spinner" /> Verifying...</>
							) : (
								<>Verify OTP <ArrowRight size={18} aria-hidden="true" /></>
							)}
						</button>
					</form>
				)}

				{step === "password" && (
					<form className="auth-form" onSubmit={handleResetPassword}>
						{newPassword && (
							<div className="auth-pw-hints" style={{ marginBottom: 12 }}>
								<span className={newPassword.length >= 8 ? "auth-hint-met" : "auth-hint-unmet"}>
									{newPassword.length >= 8 ? <Check size={12} /> : <X size={12} />} Min 8 characters
								</span>
								<span className={/[A-Z]/.test(newPassword) ? "auth-hint-met" : "auth-hint-unmet"}>
									{/[A-Z]/.test(newPassword) ? <Check size={12} /> : <X size={12} />} One uppercase letter
								</span>
								<span className={/[^a-zA-Z0-9]/.test(newPassword) ? "auth-hint-met" : "auth-hint-unmet"}>
									{/[^a-zA-Z0-9]/.test(newPassword) ? <Check size={12} /> : <X size={12} />} One special character
								</span>
							</div>
						)}

						<div className="auth-field">
							<label className="auth-label" htmlFor="newPassword">New Password</label>
							<div className="auth-pw-wrap">
								<input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									className={`auth-input${newPassword ? " has-value" : ""}`}
									placeholder="Enter Password"
									value={newPassword}
									onChange={(e) => {
										setNewPassword(e.target.value);
										setError("");
									}}
									required
									autoComplete="new-password"
								/>
								<button type="button" className="auth-eye" onClick={() => setShowNewPassword((v) => !v)} tabIndex={-1}>
									{showNewPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
								</button>
							</div>
						</div>

						<div className="auth-field">
							<label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
							<div className="auth-pw-wrap">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									className={`auth-input${confirmPassword ? " has-value" : ""}`}
									placeholder="Retype Password"
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setError("");
									}}
									required
									autoComplete="new-password"
								/>
								<button type="button" className="auth-eye" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
									{showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
								</button>
							</div>
						</div>

						{error && (
							<p className="auth-error">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button type="submit" className="auth-btn" disabled={loading || !newPassword || !confirmPassword}>
							{loading ? (
								<><div className="auth-spinner" /> Updating...</>
							) : (
								<>Reset Password <ArrowRight size={18} aria-hidden="true" /></>
							)}
						</button>
					</form>
				)}

				{step === "done" && (
					<div className="auth-form">
						<p className="auth-encrypt">Your password has been reset successfully.</p>
						<button
							type="button"
							className="auth-btn"
							onClick={() => {
								if (onBack) {
									onBack();
									return;
								}
								router.push("/auth/login");
							}}
						>
							Back to Login <ArrowRight size={18} aria-hidden="true" />
						</button>
					</div>
				)}

				{step !== "done" && (
					<>
						<div className="auth-divider">
							<div className="auth-divider-line" />
							<span className="auth-divider-txt">Remembered your password?</span>
							<div className="auth-divider-line" />
						</div>

						<p className="auth-hint" style={{ width: "100%", textAlign: "center" }}>
							<button
								type="button"
								className="auth-link"
								onClick={() => {
									if (onBack) {
										onBack();
										return;
									}
									router.push("/auth/login");
								}}
							>
								<ArrowLeft size={15} aria-hidden="true" style={{ marginRight: 4 }} />
								Back to Login
							</button>
						</p>
					</>
				)}
			</div>

			<div className="auth-social">
				<div className="auth-avatars">
					<div className="auth-av auth-av-1" />
					<div className="auth-av auth-av-2" />
					<div className="auth-av auth-av-3" />
					<div className="auth-av-count">+12</div>
				</div>
				<span className="auth-social-txt">Collaborating in TeamSync today</span>
			</div>

			<footer className="auth-footer">
				<span>© 2026 TeamSync Digital Atelier. All rights reserved.</span>
				<div className="auth-footer-links">
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
					<a href="#">Security</a>
				</div>
			</footer>
		</div>
	);
}
