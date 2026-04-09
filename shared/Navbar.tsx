import { useState } from "react";
import { Plus, Bell, Settings, LogOut, CircleDot } from "lucide-react";
import { authApi } from "@/utils/api";

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  userName: string;
  userEmail: string;
}

export default function Navbar({ collapsed, onToggleCollapse, userName, userEmail }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/auth/login";
    }
  };

  return (
    <nav className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-divider)] bg-[var(--color-surface-frost)] px-0 backdrop-blur-md">
      <div className={`flex h-full items-center gap-3 overflow-hidden border-r border-[var(--color-divider)] px-4 transition-[width,min-width] duration-300 ${collapsed ? "w-16 min-w-16" : "w-[220px] min-w-[220px]"}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border-none bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-deep)] text-[var(--color-surface)] shadow-[var(--shadow-btn)] transition hover:-translate-y-0.5 hover:opacity-95"
        >
          <CircleDot size={16} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />
        </button>

        {!collapsed && (
          <div className="overflow-hidden whitespace-nowrap transition-opacity duration-200">
            <div className="font-[var(--font-display)] text-[13.5px] font-bold leading-[1.2] text-[var(--color-text-primary)]">
              TeamSync Org
            </div>
            <div className="text-[10.5px] font-medium text-[var(--color-text-muted)]">
              Enterprise Plan
            </div>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2.5 px-4">
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border-none bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-deep)] px-4 text-[13.5px] font-semibold text-[var(--color-surface)] shadow-[var(--shadow-btn)] transition hover:-translate-y-0.5 hover:opacity-95"
        >
          <Plus size={15} /> New Meeting
        </button>

        <div className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[var(--color-input-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--color-brand-light)] hover:text-[var(--color-brand-deep)]">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-error)]" />
        </div>

        <div className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[var(--color-input-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--color-brand-light)] hover:text-[var(--color-brand-deep)]">
          <Settings size={18} />
        </div>

        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl bg-gradient-to-br from-[var(--color-db-avatar-gradient-start)] to-[var(--color-db-avatar-gradient-end)] text-[13px] font-bold uppercase text-[var(--color-surface)] shadow-[var(--shadow-shell-avatar)] transition hover:-translate-y-0.5"
          >
            {userName ? userName.charAt(0) : "U"}
          </div>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[220px] rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-3 text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
                <div className="mb-2 border-b border-[var(--color-divider)] pb-2">
                  <div className="text-sm font-semibold">{userName}</div>
                  <div className="overflow-hidden text-ellipsis text-[11px] text-[var(--color-text-muted)]">
                    {userEmail}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-[var(--color-error)] transition hover:bg-[var(--color-error-bg)]"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}