"use client";

import { useState } from "react";

import Navbar        from "@/components/dashboard/Navbar";
import Sidebar       from "@/components/dashboard/Sidebar";
import QuickActions  from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import ActivityFeed  from "@/components/dashboard/ActivityFeed";
import StatsRow      from "@/components/dashboard/StatsRow";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive]       = useState("dashboard");

  return (
    <div className="db-root">

      <Navbar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

      <div className="db-body">

        <Sidebar
          collapsed={collapsed}
          active={active}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onNavClick={setActive}
        />

        <main className="db-main">

          <div>
            <h1 className="db-welcome-title">Welcome Back, Alex.</h1>
            <p className="db-welcome-sub">
              You have 3 meetings scheduled for today and 12 unread messages.
            </p>
          </div>
          <StatsRow />

          <div className="db-content-grid">
            
            <QuickActions />
            <RecentMessages />
            <ActivityFeed />
          </div>

          

        </main>
      </div>

    </div>
  );
}