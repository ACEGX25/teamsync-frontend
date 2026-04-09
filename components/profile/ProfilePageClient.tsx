"use client";

import { useState } from "react";
import ProfileHero from "./ProfileHero";
import PersonalInfoSection from "./PersonalInfoSection";
import ProfessionalBioSection from "./ProfessionalBioSection";
import WorkPreferencesSection from "./WorkPreferencesSection";
import ProfileRightPanel from "./ProfileRightPanel";
import { UserProfile } from "@/types/profile";
import "@/styles/profile.css";

const defaultProfile: UserProfile = {
  displayName: "Alex Sterling",
  email: "alex.sterling@teamsync.io",
  phone: "+44 20 7946 0958",
  professionalHeadline: "Building the future of remote collaboration",
  bio: "Alex is a seasoned product strategist with over 10 years of experience in leading cross-functional teams to deliver impactful digital solutions. Obsessed with user-centric design and scalable architecture.",
  timezone: "GMT (UTC+0:00) London",
  primaryLanguage: "English (UK)",
  availabilityStatus: true,
  showWorkPortfolio: false,
  role: "Senior Product Strategist",
  location: "London, UK",
  notificationChannels: {
    emailAlerts: true,
    pushNotifications: true,
    usageReports: false,
  },
};

export default function ProfilePageClient() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const handleChange = (field: keyof UserProfile, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (
    channel: keyof UserProfile["notificationChannels"],
    value: boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      notificationChannels: { ...prev.notificationChannels, [channel]: value },
    }));
  };

  const handleSave = () => {
    alert("Profile saved!");
  };

  return (
    <div className="profile-page">
      <ProfileHero
        name={profile.displayName}
        title={profile.role}
        location={profile.location}
        onSave={handleSave}
      />

      <div className="profile-body">
        <div className="profile-forms">
          <PersonalInfoSection profile={profile} onChange={handleChange} />
          <ProfessionalBioSection profile={profile} onChange={handleChange} />
          <WorkPreferencesSection profile={profile} onChange={handleChange} />
        </div>

        <ProfileRightPanel
          profile={profile}
          onNotificationChange={handleNotificationChange}
        />
      </div>
    </div>
  );
}