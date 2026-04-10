"use client";

import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(135deg,var(--color-bg-page-start)_0%,var(--color-bg-page-mid)_30%,var(--color-bg-page-end)_100%)] font-[var(--font-base)]">
      {showNav && (
        <nav className="h-16 px-5 md:px-8 flex items-center justify-between bg-[color:var(--color-surface)]/70 backdrop-blur border-b border-[var(--color-divider)]">
          <span className="text-[20px] font-bold tracking-[-0.3px] text-[var(--color-text-primary)]">TeamSync</span>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-lg border border-[var(--color-input-border)] text-[var(--color-brand)] bg-[var(--color-surface)] hover:bg-[var(--color-brand-xsubtle)] transition">?</button>
            <button className="h-9 w-9 rounded-lg border border-[var(--color-input-border)] text-[var(--color-brand)] bg-[var(--color-surface)] hover:bg-[var(--color-brand-xsubtle)] transition">i</button>
          </div>
        </nav>
      )}
      <div className="flex-1">{children}</div>
      <footer className="px-6 py-5 text-center text-[12px] text-[var(--color-text-faint)] bg-[color:var(--color-surface)]/60 border-t border-[var(--color-divider)]">
        <span>© 2026 TeamSync Digital Atelier. All rights reserved.</span>
        <div className="mt-1.5 flex items-center justify-center gap-4 text-[var(--color-text-secondary)]">
          <a href="#" className="hover:opacity-80 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Terms of Service</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Security</a>
        </div>
      </footer>
    </div>
  );
}