import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const LAB_API_BASE_URL = API_URL

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRouteDefinition {
  method: HttpMethod
  path: string
  title: string
  description: string
  requiresAuth: boolean
  scope?: string
}

export type ApiRouteGroupMap = Record<string, ApiRouteDefinition[]>

export const LAB_API_ROUTES: ApiRouteGroupMap = {
  auth: [
    {
      method: 'POST',
      path: '/lab-login',
      title: 'Lab contact login',
      description: 'Simple phone-only login for lab technicians (internal app)',
      requiresAuth: false,
      scope: 'lab-login',
    },
  ],
  dashboard: [
    {
      method: 'GET',
      path: '/lab-dashboard/{phone}',
      title: 'Lab dashboard',
      description: 'Get pending lab report requests for a lab contact',
      requiresAuth: true,
      scope: 'lab-dashboard',
    },
  ],
  upload: [
    {
      method: 'POST',
      path: '/api/lab-upload-reports',
      title: 'Upload lab reports',
      description: 'Handle lab report file uploads with flexible form handling',
      requiresAuth: true,
      scope: 'lab-upload',
    },
  ],
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
      config.headers['X-Lab-Token'] = token
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      headers: config.headers,
    })
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`[API Error] ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
    })
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
    }
    return Promise.reject(error)
  }
)
