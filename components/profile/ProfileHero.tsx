"use client";

import { Camera } from "lucide-react";

interface ProfileHeroProps {
  name: string;
  title: string;
  location: string;
  onSave: () => void;
}

export default function ProfileHero({ name, title, location, onSave }: ProfileHeroProps) {
  return (
    <div className="profile-hero">
      <div className="hero-banner" />
      <div className="hero-content">
        <div className="hero-avatar-wrap">
          <img
            className="hero-avatar"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sterling&backgroundColor=b6e3f4"
            alt={name}
          />
          <button className="avatar-edit-btn" aria-label="Change avatar">
            <Camera size={13} />
          </button>
        </div>

        <div className="hero-info">
          <h1 className="hero-name">{name}</h1>
          <p className="hero-subtitle">
            {title} &bull; {location}
          </p>
        </div>

        <button className="save-btn" onClick={onSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}