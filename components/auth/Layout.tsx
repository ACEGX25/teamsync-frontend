"use client";

import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = false }: LayoutProps) {
  return (
    <div className="ts-root">
      {showNav && (
        <nav className="ts-nav">
          <span className="ts-nav-brand">TeamSync</span>
          <div className="ts-nav-actions">
            <button className="ts-icon-btn">?</button>
            <button className="ts-icon-btn">i</button>
          </div>
        </nav>
      )}
      {children}
      <footer className="ts-footer">
        <span>© 2024 TeamSync Digital Atelier. All rights reserved.</span>
        <div className="ts-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  );
}