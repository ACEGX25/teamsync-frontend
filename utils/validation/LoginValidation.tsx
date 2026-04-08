export const PRIMAVERSE_EMAIL_REGEX =
	/^[a-z0-9.]+@primaverse\.com$/;

export type PasswordStrength = {
	label: "" | "WEAK" | "FAIR" | "STRONG" | "OPTIMAL";
	level: 0 | 1 | 2 | 3 | 4;
	color: string;
};

export function sanitizePrimaverseEmailInput(raw: string): string {
	const lowered = raw.toLowerCase();
	const [localPart = "", ...rest] = lowered.split("@");
	const cleanLocalPart = localPart.replace(/[^a-z0-9.]/g, "");

	if (rest.length === 0) return cleanLocalPart;

	const cleanDomain = rest.join("@").replace(/[^a-z.]/g, "");
	return `${cleanLocalPart}@${cleanDomain}`;
}

export function toPrimaverseEmail(raw: string): string {
	const sanitized = sanitizePrimaverseEmailInput(raw);
	const [localPart = "", domain] = sanitized.split("@");

	if (!localPart) return "";
	return `${localPart}@${domain || "primaverse.com"}`;
}

export function isPrimaverseEmail(email: string): boolean {
	return PRIMAVERSE_EMAIL_REGEX.test(email);
}

export function sanitizeNameInput(raw: string): string {
	return raw.replace(/[^A-Za-z\s]/g, "");
}

export function getPasswordChecks(password: string) {
	return {
		hasMinLength: password.length >= 8,
		hasUppercase: /[A-Z]/.test(password),
		hasSpecial: /[^a-zA-Z0-9]/.test(password),
		hasLongLength: password.length >= 12,
	};
}

export function getPasswordStrength(password: string): PasswordStrength {
	if (!password) return { label: "", level: 0, color: "" };

	const checks = getPasswordChecks(password);
	let score = 0;

	if (checks.hasMinLength) score++;
	if (checks.hasUppercase) score++;
	if (checks.hasSpecial) score++;
	if (checks.hasLongLength) score++;

	if (score <= 1) return { label: "WEAK", level: 1, color: "var(--color-error)" };
	if (score === 2) return { label: "FAIR", level: 2, color: "var(--color-warn)" };
	if (score === 3) return { label: "STRONG", level: 3, color: "var(--color-success)" };

	return { label: "OPTIMAL", level: 4, color: "var(--color-optimal)" };
}

export function isPasswordPolicyValid(password: string): boolean {
	const checks = getPasswordChecks(password);
	return checks.hasMinLength && checks.hasUppercase && checks.hasSpecial;
}
