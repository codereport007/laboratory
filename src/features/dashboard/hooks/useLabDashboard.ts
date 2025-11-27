import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { LabDashboardResponse } from '@/features/lab/types'

export const useLabDashboardQuery = <TData = LabDashboardResponse | null>(
  status?: string,
  options?: Omit<
    UseQueryOptions<LabDashboardResponse | null, unknown, TData>,
    'queryKey' | 'queryFn'
  >
) => {
  const phone = useAuthStore((state) => state.labInfo?.phone)

  console.log('[useLabDashboardQuery] Hook initialized with phone:', phone, 'status:', status)

  return useQuery<LabDashboardResponse | null, unknown, TData>({
    queryKey: ['lab-dashboard', phone, status],
    queryFn: async () => {
      if (!phone) {
        console.log('[useLabDashboardQuery] No phone available, returning null')
        return null
      }
      // Build URL with optional status query param
      const url = status ? `/lab-dashboard/${phone}?status=${encodeURIComponent(status)}` : `/lab-dashboard/${phone}`
      console.log('[useLabDashboardQuery] Fetching dashboard for phone:', phone, 'url:', url)
      const { data } = await axiosInstance.get<LabDashboardResponse>(url)
      console.log('[useLabDashboardQuery] Response received:', data)
      return data
    },
    enabled: !!phone,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  })
}
