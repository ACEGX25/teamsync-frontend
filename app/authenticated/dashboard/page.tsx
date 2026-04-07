"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SectionCards } from "@/components/dashboard/section-cards"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to your TeamSync dashboard</p>
            </div>
            <SectionCards />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}