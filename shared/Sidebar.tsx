import { NAV_MAIN} from "../components/dashboard/navItems";
import { UserPlus } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  active: string;
  onNavClick: (id: string) => void;
}

export default function Sidebar({
  collapsed,
  active,
  onNavClick,
}: SidebarProps) {
  return (
    <aside
      className="db-sidebar"
      style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220 }}
    >
      {/* Main nav */}
      <nav className="db-nav">
        {/* Invite button — shown above Dashboard */}
        <button
          className="db-invite-btn"
          title={collapsed ? "Invite Members" : undefined}
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <UserPlus size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Invite Members</span>}
        </button>
        {!collapsed && <div className="db-nav-divider" />}

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

    </aside>
  );
}