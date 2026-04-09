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
		if (step === "otp") {
			inputs.current[0]?.focus();
		}
	}, [step]);

	const formatTime = (seconds: number) =>
		`${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
			.toString()
			.padStart(2, "0")}`;

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
			const response = await forgotPasswordApi.verifyForgotOtp(email, code);
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
			await forgotPasswordApi.forgotPassword(email);
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

		if (!isPasswordPolicyValid(newPassword)) {
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
			await forgotPasswordApi.resetPassword(resetToken, newPassword);
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
		<div className="min-h-screen px-6 py-8 bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-bg-page-end)_100%)] font-[var(--font-base)] flex flex-col items-center">
			<div className="w-full max-w-[420px] bg-[var(--color-surface)] rounded-[var(--radius-page)] px-11 pt-12 pb-10 shadow-[var(--shadow-card)] flex flex-col items-start">
				<div className="mb-7">
					<h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-[-0.5px] text-left">Forgot password?</h1>
					<p className="mt-2 text-[14.5px] text-[var(--color-text-secondary)] leading-[1.55] text-left">
						{step === "email" && "Enter your email and we will send an OTP to reset your password."}
						{step === "otp" && `Enter the 6-digit OTP sent to ${email}.`}
						{step === "password" && "OTP verified. Set your new password."}
						{step === "done" && "Password reset complete. You can now sign in."}
					</p>
				</div>

				{step === "email" && (
					<form className="w-full flex flex-col gap-3" onSubmit={handleSendOtp}>
						<div className="w-full flex flex-col gap-1.5">
							<label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase" htmlFor="forgotEmail">Email Address</label>
							<div className="relative flex items-center">
								<input
									id="forgotEmail"
									type="email"
									className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
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
								<span className="absolute right-3.5 p-1 text-[var(--color-text-faint)]" aria-hidden="true" style={{ pointerEvents: "none" }}>
									<Mail size={18} />
								</span>
							</div>
						</div>

						{error && (
							<p className="w-full text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-[var(--radius-input)] px-3.5 py-2.5 flex items-center gap-2">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button
							type="submit"
							className="w-full mt-1 py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
							disabled={loading || !email.trim()}
						>
							{loading ? (
								<>
									<div className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)]/50 border-t-[var(--color-surface)] animate-spin" />
									Sending...
								</>
							) : (
								<>Send OTP <ArrowRight size={18} aria-hidden="true" /></>
							)}
						</button>
					</form>
				)}

				{step === "otp" && (
					<form className="w-full flex flex-col gap-3" onSubmit={handleVerifyOtp}>
						<div className="w-full grid grid-cols-6 gap-2.5" onPaste={handleOtpPaste}>
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={(el) => {
										inputs.current[index] = el;
									}}
									className="h-[52px] rounded-[var(--radius-input)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-center text-[18px] font-semibold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
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

						<p className="text-[13px] text-[var(--color-text-secondary)] flex items-center gap-1.5 mb-1">
							<Clock3 className="text-[var(--color-brand)]" size={16} aria-hidden="true" />
							Resend code in <span className="text-[var(--color-brand-deep)] font-semibold">{formatTime(timer)}</span>
						</p>

						{timer === 0 && (
							<button type="button" className="text-[13px] text-[var(--color-brand)] font-semibold hover:opacity-75" onClick={handleResendOtp} disabled={loading}>
								Resend OTP
							</button>
						)}

						{error && (
							<p className="w-full text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-[var(--radius-input)] px-3.5 py-2.5 flex items-center gap-2">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button
							type="submit"
							className="w-full mt-1 py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
							disabled={loading || otp.join("").length !== 6}
						>
							{loading ? (
								<>
									<div className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)]/50 border-t-[var(--color-surface)] animate-spin" />
									Verifying...
								</>
							) : (
								<>Verify OTP <ArrowRight size={18} aria-hidden="true" /></>
							)}
						</button>
					</form>
				)}

				{step === "password" && (
					<form className="w-full flex flex-col gap-3" onSubmit={handleResetPassword}>
						<div className="w-full flex flex-col gap-1.5">
							<label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase" htmlFor="newPassword">New Password</label>
							<div className="relative flex items-center">
								<input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
									placeholder="Enter Password"
									value={newPassword}
									onChange={(e) => {
										setNewPassword(e.target.value);
										setError("");
									}}
									required
									autoComplete="new-password"
								/>
								<button type="button" className="absolute right-3.5 p-1 text-[var(--color-text-faint)] hover:text-[var(--color-brand)]" onClick={() => setShowNewPassword((v) => !v)} tabIndex={-1}>
									{showNewPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
								</button>
							</div>
						</div>

						<div className="w-full flex flex-col gap-1.5">
							<label className="text-[11px] font-bold tracking-[0.9px] text-[var(--color-text-muted)] uppercase" htmlFor="confirmPassword">Confirm Password</label>
							<div className="relative flex items-center">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									className="w-full py-3.5 pl-4 pr-11 border border-[var(--color-input-border)] rounded-[var(--radius-input)] bg-[var(--color-input-bg)] text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]"
									placeholder="Retype Password"
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setError("");
									}}
									required
									autoComplete="new-password"
								/>
								<button type="button" className="absolute right-3.5 p-1 text-[var(--color-text-faint)] hover:text-[var(--color-brand)]" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
									{showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
								</button>
							</div>
						</div>

						{newPassword && (
							<div className="mt-1 mb-2 flex flex-col gap-1 text-[12px]">
								<span className={`flex items-center gap-1.5 ${passwordChecks.hasMinLength ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
									{passwordChecks.hasMinLength ? <Check size={12} /> : <X size={12} />} Min 8 characters
								</span>
								<span className={`flex items-center gap-1.5 ${passwordChecks.hasUppercase ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
									{passwordChecks.hasUppercase ? <Check size={12} /> : <X size={12} />} One uppercase letter
								</span>
								<span className={`flex items-center gap-1.5 ${passwordChecks.hasSpecial ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
									{passwordChecks.hasSpecial ? <Check size={12} /> : <X size={12} />} One special character
								</span>
							</div>
						)}

						{error && (
							<p className="w-full text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-[var(--radius-input)] px-3.5 py-2.5 flex items-center gap-2">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button
							type="submit"
							className="w-full mt-1 py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
							disabled={loading || !newPassword || !confirmPassword}
						>
							{loading ? (
								<>
									<div className="h-4 w-4 rounded-full border-2 border-[var(--color-surface)]/50 border-t-[var(--color-surface)] animate-spin" />
									Updating...
								</>
							) : (
								<>Reset Password <ArrowRight size={18} aria-hidden="true" /></>
							)}
						</button>
					</form>
				)}

				{step === "done" && (
					<div className="w-full flex flex-col gap-3">
						<p className="text-[13px] text-[var(--color-text-muted)] flex items-center">Your password has been reset successfully.</p>
						<button
							type="button"
							className="w-full py-[17px] px-6 rounded-[var(--radius-btn)] text-[var(--color-surface)] text-[15.5px] font-bold border-none cursor-pointer flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] shadow-[var(--shadow-btn)] hover:opacity-[0.93] hover:-translate-y-px hover:shadow-[var(--shadow-btn-hover)] active:translate-y-0 transition-all duration-200"
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
						<div className="w-full mt-4 mb-2 flex items-center gap-3">
							<div className="h-px flex-1 bg-[var(--color-divider)]" />
							<span className="text-[12px] text-[var(--color-text-faint)]">Remembered your password?</span>
							<div className="h-px flex-1 bg-[var(--color-divider)]" />
						</div>

						<p className="w-full text-center text-[13px] text-[var(--color-text-muted)]">
							<button
								type="button"
								className="text-[var(--color-brand)] font-semibold hover:opacity-80 inline-flex items-center"
								onClick={() => {
									if (onBack) {
										onBack();
										return;
									}
									router.push("/auth/login");
								}}
							>
								<ArrowLeft size={15} aria-hidden="true" className="mr-1" />
								Back to Login
							</button>
						</p>
					</>
				)}
			</div>

			<div className="mt-5 flex flex-col items-center gap-2">
				<div className="flex items-center">
					<div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(145deg,var(--color-brand-light),var(--color-brand))]" />
					<div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(145deg,var(--color-success),var(--color-brand-deep))] -ml-2" />
					<div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(145deg,var(--color-warn),var(--color-brand))] -ml-2" />
					<div className="h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand)] text-[11px] font-bold flex items-center justify-center -ml-2">+12</div>
				</div>
				<span className="text-[12px] text-[var(--color-text-faint)]">Collaborating in TeamSync today</span>
			</div>

			<Footer />
		</div>
	);
}
