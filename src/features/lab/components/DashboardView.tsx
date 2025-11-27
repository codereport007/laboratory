import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ClipboardList, Upload } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useLabDashboardQuery } from "@/features/dashboard/hooks/useLabDashboard"
import { Button } from "@/components/ui/button"
import { UploadReportModal } from "./UploadReportModal"
import type { LabRequest } from "../types"
import { useAuthStore } from "@/store/authStore"

type ViewState = "dashboard" | "history"

interface DashboardViewProps {
  activeView: ViewState
}

export const DashboardView = ({ activeView }: DashboardViewProps) => {
  const isHistoryView = activeView === "history"
  const { data: labDashboard, isLoading } = useLabDashboardQuery(isHistoryView ? 'completed' : 'pending')
  const labInfo = useAuthStore((state) => state.labInfo)
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const requests = labDashboard?.requests ?? []

  const { pendingRequests, completedRequests } = useMemo(() => {
    const pending: LabRequest[] = []
    const completed: LabRequest[] = []

    requests.forEach((req) => {
      const status = (req.status || "").toLowerCase()
      if (status === "pending") {
        pending.push(req)
      } else {
        completed.push(req)
      }
    })

    return { pendingRequests: pending, completedRequests: completed }
  }, [requests])

  const totalCount = labDashboard?.total_requests ?? requests.length
  const pendingCount = labDashboard?.pending_count ?? pendingRequests.length
  const completedCount = labDashboard?.total_requests !== undefined && labDashboard?.pending_count !== undefined
    ? Math.max(totalCount - pendingCount, 0)
    : completedRequests.length

  const displayedRequests = isHistoryView ? completedRequests : pendingRequests

  useEffect(() => {
    if (isHistoryView) {
      setIsUploadModalOpen(false)
      setSelectedRequest(null)
    }
  }, [isHistoryView])

  const tableTitle = isHistoryView ? "Upload History" : "Lab Report Requests"
  const tableDescription = isHistoryView
    ? "Completed test uploads from your lab contacts"
    : "Pending doctor requests awaiting your uploads"
  const emptyStateText = isHistoryView ? "No completed reports yet" : "No pending requests"
  const secondaryDateLabel = isHistoryView ? "Completed On" : "Visit Date"
  const tertiaryDateLabel = isHistoryView ? "Requested On" : "Expires"
  const columnCount = isHistoryView ? 5 : 5

  const handleUploadClick = (request: LabRequest) => {
    setSelectedRequest(request)
    setIsUploadModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">{isHistoryView ? "History" : "Dashboard"}</h2>
            <p className="text-sm text-slate-500">
              {labInfo?.lab_name || 'Lab'} · {labInfo?.lab_type || 'Unknown'}
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Showing {isHistoryView ? "completed" : "pending"} requests
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Requests
            </CardTitle>
            <div className="rounded-full p-2 bg-blue-50 text-blue-600">
              <ClipboardList className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">
              {isLoading ? "…" : pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Completed Uploads
            </CardTitle>
            <div className="rounded-full p-2 bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">
              {isLoading ? "…" : completedCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Requests
            </CardTitle>
            <div className="rounded-full p-2 bg-slate-50 text-slate-700">
              <Upload className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">
              {isLoading ? "…" : totalCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tableTitle}</p>
          <p className="text-sm text-slate-500">{tableDescription}</p>
        </div>
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 border-r border-slate-200">
                      Patient
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 border-r border-slate-200">
                      Test
                    </TableHead>
                    {isHistoryView && (
                      <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 border-r border-slate-200">
                        Status
                      </TableHead>
                    )}
                    <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 border-r border-slate-200">
                      {secondaryDateLabel}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 border-r border-slate-200">
                      {tertiaryDateLabel}
                    </TableHead>
                    {!isHistoryView && (
                      <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={columnCount} className="px-4 py-10 text-center text-slate-500">
                        Loading...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && displayedRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columnCount} className="px-4 py-10 text-center text-slate-500">
                        {emptyStateText}
                      </TableCell>
                    </TableRow>
                  )}
                  {displayedRequests.map((request) => {
                    const visitDate = request.visit_date ? new Date(request.visit_date) : null
                    const expiresDate = request.expires_at ? new Date(request.expires_at) : null
                    const createdDate = request.created_at ? new Date(request.created_at) : null
                    const statusLabel = (request.status || '').toLowerCase()

                    return (
                      <TableRow
                        key={request.id}
                        className="border-b border-slate-200 last:border-b-0"
                      >
                        <TableCell className="px-4 py-4 font-medium text-slate-900 border-r border-slate-200 align-top">
                          {request.patient_name}
                          {request.patient_phone && (
                            <p className="text-xs text-slate-500">{request.patient_phone}</p>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-4 border-r border-slate-200 align-top">
                          <p className="font-medium text-slate-900">{request.test_name}</p>
                          <p className="text-xs text-slate-500">{request.report_type}</p>
                          {request.instructions && (
                            <p className="mt-1 text-xs text-slate-500">{request.instructions}</p>
                          )}
                        </TableCell>
                        {isHistoryView && (
                          <TableCell className="px-4 py-4 border-r border-slate-200 align-top">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                                statusLabel === "completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-700"
                              )}
                            >
                              {request.status || "Completed"}
                            </span>
                          </TableCell>
                        )}
                        <TableCell className="px-4 py-4 border-r border-slate-200 align-top text-sm text-slate-600">
                          {isHistoryView
                            ? createdDate?.toLocaleString() ?? "-"
                            : visitDate?.toLocaleDateString() ?? "-"}
                        </TableCell>
                        <TableCell className="px-4 py-4 border-r border-slate-200 align-top text-sm text-slate-600">
                          {isHistoryView
                            ? visitDate?.toLocaleDateString() ?? "-"
                            : expiresDate?.toLocaleString() ?? "-"}
                        </TableCell>
                        {!isHistoryView && (
                          <TableCell className="px-4 py-4 text-right align-top">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUploadClick(request)}
                              className="gap-2"
                            >
                              <Upload className="h-3 w-3" />
                              Upload
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      {!isHistoryView && selectedRequest && (
        <UploadReportModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          requestToken={selectedRequest.request_token}
          patientName={selectedRequest.patient_name}
          testName={selectedRequest.test_name}
        />
      )}
    </div>
  )
}
