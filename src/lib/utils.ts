import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { ApiRouteDefinition, ApiRouteGroupMap, HttpMethod } from "@/lib/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type FlattenedApiRoute = ApiRouteDefinition & {
  group: string
}

export function flattenRouteGroups(routeGroups: ApiRouteGroupMap): FlattenedApiRoute[] {
  return Object.entries(routeGroups).flatMap(([group, routes]) =>
    routes.map((route) => ({ ...route, group }))
  )
}

export function getHttpMethodTone(method: HttpMethod) {
  switch (method) {
    case 'GET':
      return 'bg-emerald-100 text-emerald-700'
    case 'POST':
      return 'bg-blue-100 text-blue-700'
    case 'PUT':
    case 'PATCH':
      return 'bg-amber-100 text-amber-700'
    case 'DELETE':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function describeAuthRequirement(requiresAuth: boolean) {
  return requiresAuth ? 'Lab token required' : 'Open'
}
