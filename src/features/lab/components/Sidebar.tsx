import { type LucideIcon, X, LayoutDashboard, LogOut, ChevronLeft, ChevronRight, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ViewState = "dashboard" | "history"

interface SidebarProps {
  currentView: ViewState
  onChangeView: (view: ViewState) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  labName: string
  labType: string
  onLogout: () => void
}

export const Sidebar = ({
  currentView,
  onChangeView,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  labName,
  labType,
  onLogout,
}: SidebarProps) => {
  const navItems: { id: ViewState; label: string; icon: LucideIcon }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "History", icon: History },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex-col transition-all duration-300 ease-in-out z-40",
          isCollapsed ? "w-16" : "w-72"
        )}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-slate-900">{labName}</h2>
              <p className="text-xs text-slate-500">{labType}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                currentView === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out z-50",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{labName}</h2>
            <p className="text-xs text-slate-500">{labType}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCloseMobile}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id)
                onCloseMobile()
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                currentView === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={() => {
              onLogout()
              onCloseMobile()
            }}
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
