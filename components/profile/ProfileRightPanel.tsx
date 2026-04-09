"use client";

import { ShieldCheck, ArrowRight, Info } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ProfileRightPanelProps {
  profile: UserProfile;
  onNotificationChange: (
    channel: keyof UserProfile["notificationChannels"],
    value: boolean
  ) => void;
}

export default function ProfileRightPanel({ profile, onNotificationChange }: ProfileRightPanelProps) {
  return (
    <aside className="right-panel">
      {/* Security Card */}
      <div className="panel-card">
        <div className="panel-card-header">
          <div className="panel-icon-wrap">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="panel-card-title">Security &amp; Privacy</p>
            <p className="panel-card-sub">Manage your account safety</p>
          </div>
        </div>
        <button className="review-btn">
          Review Settings <ArrowRight size={14} />
        </button>
      </div>

      {/* Notification Channels */}
      <div className="panel-card">
        <p className="panel-eyebrow">ENGAGEMENT</p>
        <h3 className="panel-card-heading">Notification Channels</h3>

        <div className="notification-list">
          {[
            {
              key: "emailAlerts" as const,
              label: "Email Alerts",
              desc: "Receive project updates and team mentions directly in your inbox.",
            },
            {
              key: "pushNotifications" as const,
              label: "Push Notifications",
              desc: "Get real-time browser alerts when activities happen.",
            },
            {
              key: "usageReports" as const,
              label: "Usage Reports",
              desc: "Weekly summaries of your activity and team performance metrics.",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="notification-item">
              <input
                type="checkbox"
                id={key}
                className="notif-checkbox"
                checked={profile.notificationChannels[key]}
                onChange={(e) => onNotificationChange(key, e.target.checked)}
              />
              <label htmlFor={key} className="notif-label">
                <span className="notif-title">{label}</span>
                <span className="notif-desc">{desc}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="privacy-note">
          <Info size={14} className="privacy-icon" />
          <div>
            <p className="privacy-title">Privacy Note</p>
            <p className="privacy-desc">
              Your notification settings are private and only visible to you. We never share your contact details.
            </p>
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="panel-card help-card">
        <p className="help-title">Need help?</p>
        <p className="help-desc">
          Our concierge team is here to help you set up your perfect workspace.
        </p>
        <button className="contact-btn">Contact Support</button>
      </div>
    </aside>
  );
}