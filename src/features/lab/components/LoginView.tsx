import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { AxiosError } from "axios"
import { ShieldCheck, UploadCloud, Phone } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { axiosInstance } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import type { LabLoginResponse } from "@/features/lab/types"

const loginSchema = z.object({
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits long")
    .regex(/^[0-9+\- ]+$/, "Only digits, spaces, plus, or dashes are allowed"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginView = () => {
  const setAuth = useAuthStore((state) => state.setAuth)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "" },
  })

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginFormValues) => {
      const { data } = await axiosInstance.post<LabLoginResponse>('/lab-login', payload)
      return data
    },
    onSuccess: (data) => {
      console.log('[LoginView] Login successful:', data)
      setAuth(data.session_token, data.lab_info)
      toast.success(`Welcome ${data.lab_info.lab_name}`)
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail ?? "Login failed"
      toast.error(detail)
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-white">
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-12">
        <div>
          <p className="uppercase tracking-[0.4em] text-sm text-white/70">
            Enterprise LIMS
          </p>
          <h1 className="text-4xl font-semibold mt-6">
            Clinically clean. Enterprise secure.
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            Log in with your registered lab contact number to access pending
            report requests, upload findings securely, and sync instantly with
            the doctor dashboard.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-12 w-12 text-white/90" />
            <div>
              <p className="text-sm text-white/60">Zero Trust Security</p>
              <p className="text-base font-medium">JWT scoped to lab devices</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UploadCloud className="h-12 w-12 text-white/90" />
            <div>
              <p className="text-sm text-white/60">Encrypted uploads</p>
              <p className="text-base font-medium">
                Hardened object storage with audit-ready logs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-white text-slate-900 p-8 sm:p-16">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-500 uppercase tracking-wide">
              Lab network portal
            </p>
            <h2 className="text-3xl font-bold mt-2">Secure Lab Login</h2>
            <p className="text-slate-500 mt-2">
              Only verified pathology and radiology partners are authorised for
              this module.
            </p>
          </div>

          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="phone">Lab contact number</Label>
              <Input
                id="phone"
                placeholder="e.g. +91 90000 00000"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating…" : "Continue to dashboard"}
            </Button>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4" />
              Need access? Contact the doctor to be added as a trusted lab.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
