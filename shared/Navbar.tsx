import { useState } from "react";
import { Plus, Bell, Settings, LogOut, CircleDot } from "lucide-react";
import { authApi } from "@/utils/api"; 

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNewMeeting: () => void;
  userName: string;
  userEmail: string;
}

export default function Navbar({ collapsed, onToggleCollapse, onNewMeeting, userName, userEmail }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = "/auth/login"; 
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if the server call fails to ensure user is logged out locally
      window.location.href = "/auth/login";
    }
  };

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
          <CircleDot size={16} color="var(--color-db-icon-on-color)" strokeWidth={2.5} />
        </button>
        {!collapsed && (
          <div className="db-brand-info">
            <div className="db-brand-name">TeamSync Org</div>
            <div className="db-brand-plan">Enterprise Plan</div>
          </div>
        )}
      </div>

      <div className="db-navbar-right">
        <button className="db-new-meeting-btn" onClick={onNewMeeting}>
          <Plus size={15} /> New Meeting
        </button>
        <div className="db-icon-btn">
          <Bell size={18} />
          <span className="db-notif-dot" />
        </div>
        <div className="db-icon-btn">
          <Settings size={18} />
        </div>

        {/* Profile Dropdown Container */}
        <div className="db-profile-section" style={{ position: 'relative' }}>
          <div 
            className="db-avatar" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {userName ? userName.charAt(0) : "U"}
          </div>

          {isDropdownOpen && (
            <>
              {/* Overlay to close dropdown when clicking outside */}
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 10 }} 
                onClick={() => setIsDropdownOpen(false)} 
              />
              
              <div className="db-dropdown-menu" style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                background: 'var(--color-db-dropdown-bg)',
                border: '1px solid var(--color-db-border)',
                borderRadius: '8px',
                padding: '12px',
                minWidth: '180px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 20,
                color: 'var(--color-db-text)'
              }}>
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--color-db-border-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{userName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-db-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userEmail}
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    width: '100%', 
                    border: 'none', 
                    background: 'none', 
                    color: 'var(--color-error)', 
                    cursor: 'pointer', 
                    padding: '6px 0',
                    fontSize: '14px',
                    fontWeight: 500
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

