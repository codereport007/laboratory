// Lab request structure matching backend /lab-dashboard/{phone} response
export interface LabRequest {
  id: number
  visit_id: number
  patient_id: number
  doctor_firebase_uid: string
  patient_name: string
  report_type: string
  test_name: string
  instructions?: string
  status: string
  request_token: string
  expires_at: string
  created_at: string
  patient_phone?: string
  visit_date?: string
  visit_type?: string
  chief_complaint?: string
  contact_source?: string
}

// Lab contact info from backend
export interface LabContactInfo {
  id?: number
  doctor_firebase_uid?: string
  doctor_name?: string
  contact_phone?: string
  is_active?: boolean
  source?: string
  lab_type?: string
  lab_name?: string
  available_lab_types?: string[]
}

// Lab dashboard response structure
export interface LabDashboardResponse {
  lab_contact_info: LabContactInfo
  phone: string
  total_requests: number
  pending_count: number
  requests: LabRequest[]
}

// Lab login response
export interface LabLoginResponse {
  message: string
  session_token: string
  lab_info: {
    lab_name: string
    lab_type: string
    phone: string
    available_types: string[]
    source: string
  }
}
