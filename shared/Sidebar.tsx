import { NAV_MAIN } from "../components/dashboard/navItems";
import { UserPlus } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  active: string;
  onNavClick: (id: string) => void;
}

export default function Sidebar({ collapsed, active, onNavClick }: SidebarProps) {
  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      minWidth: collapsed ? 64 : 220,
      background: "var(--color-surface)",
      borderRight: "1px solid var(--color-divider)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease, min-width 0.3s ease",
      overflow: "hidden",
      position: "relative",
    }}>

      <nav style={{
        flex: 1,
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        overflowX: "hidden",
      }}>

        {/* Invite button */}
        <button
          title={collapsed ? "Invite Members" : undefined}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10,
            padding: "11px 16px",
            borderRadius: 12,
            background: "var(--color-brand-gradient)",
            border: "none",
            color: "var(--color-db-icon-on-color)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            margin: "8px 10px 12px",
            transition: "opacity 0.2s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            boxShadow: "0 3px 12px rgba(109,40,217,0.25)",
          }}
        >
          <UserPlus size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Invite Members</span>}
        </button>

        {!collapsed && (
          <div style={{
            height: 1,
            background: "var(--color-divider)",
            margin: "8px 10px",
            flexShrink: 0,
          }} />
        )}

        {NAV_MAIN.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              title={collapsed ? item.label : undefined}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--color-brand-xsubtle)";
                  e.currentTarget.style.color = "var(--color-brand-deep)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                color: isActive ? "var(--color-brand-deep)" : "var(--color-text-secondary)",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s",
                border: "none",
                background: isActive ? "var(--color-brand-subtle)" : "none",
                fontFamily: "'DM Sans', sans-serif",
                width: "100%",
                textAlign: "left",
              }}
            >
              {item.icon}
              {!collapsed && (
                <span style={{ transition: "opacity 0.2s ease", overflow: "hidden" }}>
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