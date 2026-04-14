import { NAV_MAIN } from "../components/dashboard/navItems";
import { UserPlus } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  active: string;
  onNavClick: (id: string) => void;
}

export default function Sidebar({ collapsed, active, onNavClick }: SidebarProps) {
  return (
    <aside className={`relative flex shrink-0 flex-col overflow-hidden border-r border-(--color-divider) bg-(--color-surface-frost) backdrop-blur-md transition-[width,min-width] duration-300 ${collapsed ? "w-16 min-w-16" : "w-[220px] min-w-[220px]"}`}>
      <nav className="flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto px-2.5 py-4">
        {/* <button
          title={collapsed ? "Invite Members" : undefined}
          className={`group mb-1.5 mt-2 inline-flex items-center gap-2.5 rounded-2xl border border-transparent bg-linear-to-r from-(--color-brand) to-(--color-brand-deep) px-4 py-3 text-sm font-semibold text-[var(--color-surface)] shadow-[var(--shadow-shell-cta)] transition hover:-translate-y-0.5 hover:opacity-95 ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <UserPlus size={15} strokeWidth={2.5} className="shrink-0" />
          {!collapsed && <span>Invite Members</span>}
        </button> */}

        {/* {!collapsed && (
          <div className="mx-2 my-2 h-px shrink-0 bg-(--color-divider)" />
        )} */}

        {NAV_MAIN.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              title={collapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-2.5 rounded-2xl border-none px-3 py-2.5 text-left text-[13.5px] font-medium transition ${collapsed ? "justify-center" : "justify-start"} ${isActive ? "bg-[var(--color-brand-subtle)] font-semibold text-[var(--color-brand-deep)] shadow-[var(--shadow-shell-active)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-xsubtle)] hover:text-[var(--color-brand-deep)]"}`}
            >
              <Icon size={18} strokeWidth={2.1} className="shrink-0" />
              {!collapsed && (
                <span className="overflow-hidden transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}