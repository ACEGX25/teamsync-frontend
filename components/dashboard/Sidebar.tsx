import { NAV_MAIN, NAV_BOTTOM } from "./navItems";

interface SidebarProps {
  collapsed: boolean;
  active: string;
  onToggleCollapse: () => void;
  onNavClick: (id: string) => void;
}

export default function Sidebar({
  collapsed,
  active,
  onToggleCollapse,
  onNavClick,
}: SidebarProps) {
  return (
    <aside
      className="db-sidebar"
      style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}
    >
      {/* Main nav */}
      <nav className="db-nav">
        {NAV_MAIN.map((item) => (
          <button
            key={item.id}
            className={`db-nav-item${active === item.id ? " active" : ""}`}
            onClick={() => onNavClick(item.id)}
            title={collapsed ? item.label : undefined}
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            {item.icon}
            {!collapsed && (
              <span className="db-nav-label">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Invite button — hidden when collapsed */}
      {!collapsed && (
        <button className="db-invite-btn">
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          <span>Invite Members</span>
        </button>
      )}

      {/* Bottom nav */}
      <div className="db-sidebar-bottom">
        <div className="db-nav-divider" />
        {NAV_BOTTOM.map((item) => (
          <button
            key={item.id}
            className={`db-nav-item${active === item.id ? " active" : ""}`}
            onClick={() => onNavClick(item.id)}
            title={collapsed ? item.label : undefined}
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            {item.icon}
            {!collapsed && (
              <span className="db-nav-label">{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}