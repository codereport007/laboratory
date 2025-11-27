import { Menu, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewState = "dashboard" | "history"

interface TopBarProps {
  labName: string
  labType: string
  phone: string
  activeView: ViewState
  onMenuClick: () => void
}

export const TopBar = ({ labName, labType, phone, activeView, onMenuClick }: TopBarProps) => {
  const viewLabel = activeView === "history" ? "History" : "Pending Requests"

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">{labName}</h1>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {viewLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500">{labType}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-4 w-4" />
          <span className="font-medium">{phone}</span>
        </div>
      </div>
    </header>
  )
}
