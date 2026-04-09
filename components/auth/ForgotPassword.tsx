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
		pasted.split("").forEach((char, i) => {
			next[i] = char;
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
			setError(err instanceof Error ? err.message : "Failed to reset password.");
		} finally {
			setLoading(false);
		}
	};

	const goBack = () => (onBack ? onBack() : router.push("/auth/login"));

	const inputClass =
		"w-full rounded-[var(--radius-input)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-4 py-3.5 text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[var(--shadow-focus)]";
	const labelClass = "text-[11px] font-bold uppercase tracking-[0.9px] text-[var(--color-text-muted)]";
	const primaryBtnClass =
		"flex w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] px-6 py-[17px] text-[15.5px] font-bold text-[var(--color-surface)] shadow-[var(--shadow-btn)] transition-all duration-200 hover:-translate-y-px hover:opacity-95 hover:shadow-[var(--shadow-btn-hover)] disabled:cursor-not-allowed disabled:bg-[linear-gradient(135deg,var(--color-btn-disabled-start),var(--color-btn-disabled-end))] disabled:shadow-none";

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_60%_10%,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-auth-page-mid)_60%,var(--color-bg-page-end)_100%)] px-6 py-6 font-[var(--font-base)]">
			<div className="flex w-full max-w-[420px] flex-col items-start rounded-[var(--radius-page)] bg-[var(--color-surface)] px-11 pb-10 pt-12 shadow-[var(--shadow-card)]">
				<div className="mb-7">
					<h1 className="mb-2.5 text-[28px] font-bold tracking-[-0.6px] text-[var(--color-text-primary)]">Forgot password?</h1>
					<p className="m-0 text-[14.5px] leading-[1.55] text-[var(--color-text-secondary)]">
						{step === "email" && "Enter your email and we will send an OTP to reset your password."}
						{step === "otp" && `Enter the 6-digit OTP sent to ${email}.`}
						{step === "password" && "OTP verified. Set your new password."}
						{step === "done" && "Password reset complete. You can now sign in."}
					</p>
				</div>

				{step === "email" && (
					<form className="flex w-full flex-col gap-5" onSubmit={handleSendOtp}>
						<div className="flex flex-col gap-1.5">
							<label className={labelClass} htmlFor="forgotEmail">Email Address</label>
							<div className="relative flex items-center">
								<input
									id="forgotEmail"
									type="email"
									className={`${inputClass} pr-12`}
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
								<span className="pointer-events-none absolute right-3.5 text-[var(--color-text-faint)]">
									<Mail size={18} />
								</span>
							</div>
						</div>

						{error && (
							<p className="m-0 flex items-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--color-error)]">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button type="submit" className={primaryBtnClass} disabled={loading || !email.trim()}>
							{loading ? (
								<>
									<span className="inline-block h-[18px] w-[18px] animate-[auth-spin_0.7s_linear_infinite] rounded-full border-[2.5px] border-[var(--color-spinner-track)] border-t-[var(--color-surface)]" />
									Sending...
								</>
							) : (
								<>
									Send OTP <ArrowRight size={18} aria-hidden="true" />
								</>
							)}
						</button>
					</form>
				)}

				{step === "otp" && (
					<form className="flex w-full flex-col gap-5" onSubmit={handleVerifyOtp}>
						<div className="mb-2 flex w-full justify-center gap-2.5" onPaste={handleOtpPaste}>
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={(el) => {
										inputs.current[index] = el;
									}}
									className={`h-[58px] w-[52px] rounded-[var(--radius-input)] border-[1.5px] text-center text-[20px] font-semibold text-[var(--color-text-primary)] outline-none caret-[var(--color-brand)] ${digit ? "border-[var(--color-brand-light)] bg-[var(--color-surface)]" : "border-[var(--color-input-border)] bg-[var(--color-input-bg)]"}`}
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

						<p className="m-0 flex items-center justify-center gap-1.5 text-[13.5px] text-[var(--color-text-secondary)]">
							<Clock3 size={16} color="var(--color-brand)" aria-hidden="true" />
							Resend code in <span className="font-bold tabular-nums text-[var(--color-brand-deep)]">{formatTime(timer)}</span>
						</p>

						{timer === 0 && (
							<button type="button" className="mx-auto bg-transparent text-[13.5px] font-semibold text-[var(--color-brand)] underline underline-offset-2" onClick={handleResendOtp} disabled={loading}>
								Resend OTP
							</button>
						)}

						{error && (
							<p className="m-0 flex items-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--color-error)]">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button type="submit" className={primaryBtnClass} disabled={loading || otp.join("").length !== 6}>
							{loading ? (
								<>
									<span className="inline-block h-[18px] w-[18px] animate-[auth-spin_0.7s_linear_infinite] rounded-full border-[2.5px] border-[var(--color-spinner-track)] border-t-[var(--color-surface)]" />
									Verifying...
								</>
							) : (
								<>
									Verify OTP <ArrowRight size={18} aria-hidden="true" />
								</>
							)}
						</button>
					</form>
				)}

				{step === "password" && (
					<form className="flex w-full flex-col gap-5" onSubmit={handleResetPassword}>
						{[
							{
								id: "newPassword",
								label: "New Password",
								value: newPassword,
								show: showNewPassword,
								toggle: () => setShowNewPassword((v) => !v),
								onChange: (v: string) => {
									setNewPassword(v);
									setError("");
								},
								placeholder: "Enter Password",
							},
							{
								id: "confirmPassword",
								label: "Confirm Password",
								value: confirmPassword,
								show: showConfirmPassword,
								toggle: () => setShowConfirmPassword((v) => !v),
								onChange: (v: string) => {
									setConfirmPassword(v);
									setError("");
								},
								placeholder: "Retype Password",
							},
						].map((field) => (
							<div key={field.id} className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor={field.id}>{field.label}</label>
								<div className="relative flex items-center">
									<input
										id={field.id}
										type={field.show ? "text" : "password"}
										className={`${inputClass} pr-12`}
										placeholder={field.placeholder}
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
										required
										autoComplete="new-password"
									/>
									<button type="button" onClick={field.toggle} tabIndex={-1} className="absolute right-3.5 p-1 text-[var(--color-text-faint)] hover:text-[var(--color-brand)]">
										{field.show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
									</button>
								</div>
							</div>
						))}

						{newPassword && (
							<div className="-mt-1 flex flex-col gap-1">
								{[
									{ met: passwordChecks.hasMinLength, label: "Min 8 characters" },
									{ met: passwordChecks.hasUppercase, label: "One uppercase letter" },
									{ met: passwordChecks.hasSpecial, label: "One special character" },
								].map(({ met, label }) => (
									<span key={label} className={`flex items-center gap-1.5 text-[12px] font-medium ${met ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
										{met ? <Check size={12} /> : <X size={12} />} {label}
									</span>
								))}
							</div>
						)}

						{error && (
							<p className="m-0 flex items-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] px-3.5 py-2.5 text-[13px] text-[var(--color-error)]">
								<AlertCircle size={15} color="var(--color-error)" aria-hidden="true" />
								{error}
							</p>
						)}

						<button type="submit" className={primaryBtnClass} disabled={loading || !newPassword || !confirmPassword}>
							{loading ? (
								<>
									<span className="inline-block h-[18px] w-[18px] animate-[auth-spin_0.7s_linear_infinite] rounded-full border-[2.5px] border-[var(--color-spinner-track)] border-t-[var(--color-surface)]" />
									Updating...
								</>
							) : (
								<>
									Reset Password <ArrowRight size={18} aria-hidden="true" />
								</>
							)}
						</button>
					</form>
				)}

				{step === "done" && (
					<div className="flex w-full flex-col gap-5">
						<p className="text-[13.5px] font-medium text-[var(--color-text-secondary)]">
							Your password has been reset successfully.
						</p>
						<button type="button" className={primaryBtnClass} onClick={goBack}>
							Back to Login <ArrowRight size={18} aria-hidden="true" />
						</button>
					</div>
				)}

				{step !== "done" && (
					<>
						<div className="my-5 flex w-full items-center gap-3">
							<div className="h-px flex-1 bg-[var(--color-divider)]" />
							<span className="whitespace-nowrap text-[12px] font-medium text-[var(--color-text-faint)]">Remembered your password?</span>
							<div className="h-px flex-1 bg-[var(--color-divider)]" />
						</div>

						<p className="m-0 flex w-full items-center justify-center text-[12.5px] text-[var(--color-text-muted)]">
							<button type="button" className="flex items-center gap-1 bg-transparent p-0 font-semibold text-[var(--color-brand)] underline underline-offset-2" onClick={goBack}>
								<ArrowLeft size={15} aria-hidden="true" />
								Back to Login
							</button>
						</p>
					</>
				)}
			</div>

			<div className="mt-6 flex items-center gap-2.5">
				<div className="flex items-center">
					<div className="h-[30px] w-[30px] rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(135deg,var(--color-auth-av-1-start),var(--color-brand))]" />
					<div className="-ml-2 h-[30px] w-[30px] rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(135deg,var(--color-auth-av-2-start),var(--color-auth-av-2-end))]" />
					<div className="-ml-2 h-[30px] w-[30px] rounded-full border-2 border-[var(--color-surface)] bg-[linear-gradient(135deg,var(--color-auth-av-3-start),var(--color-auth-av-3-end))]" />
					<div className="-ml-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-brand-xsubtle)] text-[10px] font-bold text-[var(--color-brand)]">
						+12
					</div>
				</div>
				<span className="text-[12.5px] font-medium text-[var(--color-text-muted)]">Collaborating in TeamSync today</span>
			</div>

			<Footer />
		</div>
	);
}
