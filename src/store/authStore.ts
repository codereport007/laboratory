import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LabInfo {
  lab_name: string
  lab_type: string
  phone: string
  available_types: string[]
  source: string
}

interface AuthState {
  token: string | null
  labInfo: LabInfo | null
  hasHydrated: boolean
  setAuth: (token: string, labInfo: LabInfo) => void
  clearAuth: () => void
  setHydrated: (hydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      labInfo: null,
      hasHydrated: false,
      setAuth: (token, labInfo) => set({ token, labInfo }),
      clearAuth: () => set({ token: null, labInfo: null }),
      setHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'lims-auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
