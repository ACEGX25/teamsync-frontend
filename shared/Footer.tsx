export default function Footer() {
  return (
    <footer className="mt-10 flex w-full max-w-[680px] flex-col items-center justify-between gap-3 border-t border-[var(--color-divider)] px-6 py-5 text-center text-[12px] text-[var(--color-text-faint)] font-[var(--font-base)] sm:flex-row sm:text-left">
      <span>© 2026 TeamSync Digital Atelier. All rights reserved.</span>
      <div className="flex gap-5 text-[var(--color-text-faint)]">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Security</a>
      </div>
    </footer>
  );
}
  