import { Search, Plus, Bell, Settings } from "lucide-react";

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Navbar({ collapsed, onToggleCollapse }: NavbarProps) {
  return (
    <nav className="db-navbar">
      <div
        className="db-navbar-brand"
        style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}
      >
        <button
          type="button"
          className="db-brand-logo"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="8" stroke="white" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="3" fill="white" />
          </svg>
        </button>
        {!collapsed && (
          <div className="db-brand-info">
            <div className="db-brand-name">TeamSync Org</div>
            <div className="db-brand-plan">Enterprise Plan</div>
          </div>
        )}
      </div>

      <span className="db-navbar-title" style={{ marginLeft: 20 }}>
        TeamSync
      </span>

      <div className="db-search">
        <Search size={15} />
        <input placeholder="Search syncs, teams, or messages..." />
      </div>

      <div className="db-navbar-right">
        <button className="db-new-meeting-btn">
          <Plus size={15} /> New Meeting
        </button>
        <div className="db-icon-btn">
          <Bell size={18} />
          <span className="db-notif-dot" />
        </div>
        <div className="db-icon-btn">
          <Settings size={18} />
        </div>
        <div className="db-avatar">A</div>
      </div>
    </nav>
  );
}