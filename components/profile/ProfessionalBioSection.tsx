"use client";

import { UserProfile } from "@/types/profile";

interface ProfessionalBioSectionProps {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: string) => void;
}

export default function ProfessionalBioSection({ profile, onChange }: ProfessionalBioSectionProps) {
  return (
    <section className="form-section">
      <p className="section-label">NARRATIVE</p>
      <h2 className="section-title">Professional Bio</h2>

      <textarea
        className="field-textarea"
        rows={5}
        value={profile.bio}
        onChange={(e) => onChange("bio", e.target.value)}
        placeholder="Tell your team about yourself..."
      />
    </section>
  );
}