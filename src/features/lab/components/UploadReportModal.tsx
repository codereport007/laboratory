import { useState } from 'react'
import { X, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUploadReport } from '../hooks/useUploadReport'

interface UploadReportModalProps {
  isOpen: boolean
  onClose: () => void
  requestToken: string
  patientName: string
  testName: string
}

export const UploadReportModal = ({
  isOpen,
  onClose,
  requestToken,
  patientName,
  testName,
}: UploadReportModalProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState('')
  const { mutate: uploadReport, isPending } = useUploadReport()

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    uploadReport(
      { request_token: requestToken, files, notes },
      {
        onSuccess: () => {
          onClose()
          setFiles([])
          setNotes('')
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Report</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 space-y-1">
          <p className="text-sm text-slate-500">Patient: <span className="font-medium text-slate-900">{patientName}</span></p>
          <p className="text-sm text-slate-500">Test: <span className="font-medium text-slate-900">{testName}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-file">Select Report Files</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="report-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">PDF, PNG, JPG (MAX. 10MB each, multiple files allowed)</p>
                    </div>
                    <Input id="report-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" multiple />
                </label>
            </div>
            {files.length > 0 && (
                <div className="text-sm text-emerald-600 font-medium">
                  <p>Selected {files.length} file(s):</p>
                  <ul className="text-xs mt-1 space-y-1">
                    {files.map((f, idx) => (
                      <li key={idx}>• {f.name}</li>
                    ))}
                  </ul>
                </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              type="text"
              placeholder="Add any notes about the report..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={files.length === 0 || isPending}>
              {isPending ? 'Uploading...' : 'Upload Reports'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
