"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginView } from "@/features/lab/components/LoginView"
import { useAuthStore } from "@/store/authStore"

export default function Page() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const labInfo = useAuthStore((state) => state.labInfo)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  useEffect(() => {
    if (hasHydrated && token && labInfo) {
      router.push("/dashboard")
    }
  }, [hasHydrated, token, labInfo, router])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Loading your session…</p>
      </div>
    )
  }

  if (token && labInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Redirecting to dashboard…</p>
      </div>
    )
  }

  return <LoginView />
}

