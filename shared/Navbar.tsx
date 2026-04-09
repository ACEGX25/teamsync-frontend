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
    <nav style={{
      height: 56,
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-divider)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px 0 0",
      gap: 12,
      flexShrink: 0,
      zIndex: 100,
    }}>

      {/* Brand */}
      <div style={{
        width: collapsed ? 64 : 220,
        minWidth: collapsed ? 64 : 220,
        transition: "width 0.3s ease, min-width 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        borderRight: "1px solid var(--color-divider)",
        height: "100%",
        overflow: "hidden",
      }}>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "var(--color-brand-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "var(--shadow-btn)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <CircleDot size={16} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />
        </button>

        {!collapsed && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap", transition: "opacity 0.2s ease, width 0.3s ease" }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              TeamSync Org
            </div>
            <div style={{ fontSize: 10.5, color: "var(--color-text-muted)", fontWeight: 500 }}>
              Enterprise Plan
            </div>
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>

        {/* New Meeting */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 16px",
            height: 36,
            background: "var(--color-brand-gradient)",
            border: "none",
            borderRadius: 10,
            color: "var(--color-db-icon-on-color)",
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            boxShadow: "var(--shadow-btn)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          <Plus size={15} /> New Meeting
        </button>

        {/* Bell */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1.5px solid var(--color-input-border)",
          background: "var(--color-surface)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--color-text-secondary)", position: "relative",
        }}>
          <Bell size={18} />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--color-error)",
            border: "1.5px solid var(--color-surface)",
          }} />
        </div>

        {/* Settings */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1.5px solid var(--color-input-border)",
          background: "var(--color-surface)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--color-text-secondary)",
        }}>
          <Settings size={18} />
        </div>

        {/* Avatar + Dropdown */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--color-db-avatar-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "var(--color-db-icon-on-color)",
              cursor: "pointer", flexShrink: 0, textTransform: "uppercase",
            }}
          >
            {userName ? userName.charAt(0) : "U"}
          </div>

          {isDropdownOpen && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setIsDropdownOpen(false)}
              />
              <div style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                background: "var(--color-surface)",
                border: "1px solid var(--color-divider)",
                borderRadius: 8,
                padding: 12,
                minWidth: 180,
                boxShadow: "var(--shadow-card)",
                zIndex: 20,
                color: "var(--color-text-primary)",
              }}>
                <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid var(--color-divider)" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{userName}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {userEmail}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", border: "none", background: "none",
                    color: "var(--color-error)", cursor: "pointer",
                    padding: "6px 0", fontSize: 14, fontWeight: 500,
                  }}
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