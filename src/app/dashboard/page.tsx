"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardView } from "@/features/lab/components/DashboardView"
import { Sidebar } from "@/features/lab/components/Sidebar"
import { TopBar } from "@/features/lab/components/TopBar"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

type ViewState = "dashboard" | "history"

export default function DashboardPage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const labInfo = useAuthStore((state) => state.labInfo)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<ViewState>("dashboard")

  useEffect(() => {
    if (hasHydrated && (!token || !labInfo)) {
      router.push("/")
    }
  }, [hasHydrated, token, labInfo, router])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Loading your session…</p>
      </div>
    )
  }

  if (!token || !labInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => {
            setCurrentView(view)
            setIsMobileSidebarOpen(false)
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          labName={labInfo.lab_name}
          labType={labInfo.lab_type}
          onLogout={() => {
            clearAuth()
            router.push("/")
          }}
        />
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div className={cn("flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out", isSidebarCollapsed ? "md:ml-16" : "ml-56 md:ml-72")}>
          <TopBar
            labName={labInfo.lab_name}
            labType={labInfo.lab_type}
            phone={labInfo.phone}
            activeView={currentView}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />

          <main className="flex-1 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <DashboardView activeView={currentView} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
