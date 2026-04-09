"use client";

import { UserProfile } from "@/types/profile";

interface PersonalInfoSectionProps {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: string) => void;
}

export default function PersonalInfoSection({ profile, onChange }: PersonalInfoSectionProps) {
  return (
    <section className="form-section">
      <p className="section-label">IDENTITY</p>
      <h2 className="section-title">Personal Information</h2>

      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">Display Name</label>
          <input
            className="field-input"
            value={profile.displayName}
            onChange={(e) => onChange("displayName", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Email Address</label>
          <input
            className="field-input"
            type="email"
            value={profile.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Phone Number</label>
          <input
            className="field-input"
            type="tel"
            value={profile.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="field-label">Professional Headline</label>
          <input
            className="field-input"
            value={profile.professionalHeadline}
            onChange={(e) => onChange("professionalHeadline", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}