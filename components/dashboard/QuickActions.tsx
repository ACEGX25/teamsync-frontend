import { Video, Building2 } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="db-card">
      <div className="db-card-title">Quick Actions</div>

      <button className="db-qa-btn db-qa-btn--primary">
        <div className="db-qa-icon" style={{ background: "rgba(109,40,217,0.15)" }}>
          <Video size={17} />
        </div>
        Start a Meeting
      </button>

      <button className="db-qa-btn db-qa-btn--secondary">
        <div className="db-qa-icon" style={{ background: "#ece9f8" }}>
          <Building2 size={17} />
        </div>
        Create Organization
      </button>

      <div className="db-upcoming">
        <p className="db-upcoming-label">Upcoming Next</p>
        <div className="db-upcoming-item">
          <div className="db-upcoming-bar" />
          <div>
            <div className="db-upcoming-name">Product Sync</div>
            <div className="db-upcoming-time">10:30 AM – 11:15 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
}