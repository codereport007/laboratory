import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/api'
import { toast } from 'sonner'

interface UploadReportPayload {
  request_token: string
  files: File[]
  notes?: string
}

export const useUploadReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ request_token, files, notes }: UploadReportPayload) => {
      const formData = new FormData()
      formData.append('request_token', request_token)
      
      if (notes) {
        formData.append('notes', notes)
      }
      
      // Append all files with the same key name as backend expects
      files.forEach((file) => {
        formData.append('files', file)
      })

      const { data } = await axiosInstance.post(
        '/api/lab-upload-reports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Report uploaded successfully')
      queryClient.invalidateQueries({ queryKey: ['lab-dashboard'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to upload report')
    },
  })
}
