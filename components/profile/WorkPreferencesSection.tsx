"use client";

import { UserProfile } from "@/types/profile";

interface WorkPreferencesSectionProps {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: string | boolean) => void;
}

const timezones = [
  "GMT (UTC+0:00) London",
  "EST (UTC-5:00) New York",
  "PST (UTC-8:00) Los Angeles",
  "IST (UTC+5:30) Mumbai",
  "CET (UTC+1:00) Paris",
  "JST (UTC+9:00) Tokyo",
];

const languages = ["English (UK)", "English (US)", "French", "German", "Spanish", "Hindi"];

export default function WorkPreferencesSection({ profile, onChange }: WorkPreferencesSectionProps) {
  return (
    <section className="form-section">
      <p className="section-label">LOGISTICS</p>
      <h2 className="section-title">Work Preferences</h2>

      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">Timezone</label>
          <select
            className="field-select"
            value={profile.timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div className="form-field toggle-field">
          <div className="toggle-info">
            <span className="toggle-label">Availability Status</span>
            <span className="toggle-sub">Visible to all team members</span>
          </div>
          <button
            className={`toggle ${profile.availabilityStatus ? "on" : ""}`}
            onClick={() => onChange("availabilityStatus", !profile.availabilityStatus)}
            aria-label="Toggle availability"
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        <div className="form-field">
          <label className="field-label">Primary Language</label>
          <select
            className="field-select"
            value={profile.primaryLanguage}
            onChange={(e) => onChange("primaryLanguage", e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-field toggle-field">
          <div className="toggle-info">
            <span className="toggle-label">Show Work Portfolio</span>
            <span className="toggle-sub">Public link on profile</span>
          </div>
          <button
            className={`toggle ${profile.showWorkPortfolio ? "on" : ""}`}
            onClick={() => onChange("showWorkPortfolio", !profile.showWorkPortfolio)}
            aria-label="Toggle work portfolio"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>
    </section>
  );
}