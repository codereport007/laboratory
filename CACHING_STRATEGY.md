# Caching Strategy Documentation

## Overview
This application uses React Query (TanStack Query) for efficient data fetching and caching to optimize performance and reduce unnecessary API calls.

## Global Cache Configuration

### Query Defaults (Applied to all queries)
- **staleTime**: 5 minutes (300,000ms)
  - Data is considered "fresh" for 5 minutes after fetching
  - No automatic refetching during this period
  
- **gcTime** (Garbage Collection Time): 10 minutes (600,000ms)
  - Previously called `cacheTime`
  - Cached data is retained in memory for 10 minutes after becoming unused
  - Allows instant loading when navigating back to previously viewed data

- **refetchOnWindowFocus**: false
  - Prevents unnecessary refetches when user returns to the browser tab
  - Reduces server load and improves user experience

- **refetchOnMount**: false
  - Components won't refetch if cached data is still fresh
  - Faster page loads for recently viewed data

- **refetchOnReconnect**: true
  - Automatically refetches data when internet connection is restored
  - Ensures data consistency after network interruptions

- **retry**: 2 attempts
  - Failed requests retry up to 2 times
  - Exponential backoff: 1s, 2s, max 30s

### Mutation Defaults
- **retry**: 1 attempt
- **retryDelay**: 1 second

## Query-Specific Configurations

### Lab Dashboard Query
**Key**: `['lab-dashboard', phone]`

```typescript
{
  staleTime: 5 * 60 * 1000,        // 5 minutes
  gcTime: 10 * 60 * 1000,          // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled: !!phone,                // Only fetch when phone is available
}
```

**Invalidation Triggers**:
- After successful report upload
- Manual refresh by user

**Usage**: Main dashboard showing pending/completed lab requests

---

### Tests Query
**Key**: `['lab-dashboard', phone]` (uses same cache as dashboard)

```typescript
{
  enabled: true,
  select: (data) => transform(data),  // Transforms dashboard data for tests view
}
```

**Notes**: 
- Shares cache with dashboard query for efficiency
- Uses `select` to transform data without additional API calls

---

### Patients Query
**Key**: `['lab-dashboard', phone]` (uses same cache as dashboard)

```typescript
{
  select: (data) => aggregatePatients(data),  // Aggregates patient data
}
```

**Notes**:
- Shares cache with dashboard query
- Aggregates lab requests by patient

---

## Cache Invalidation Strategy

### Automatic Invalidation
1. **After Upload**: `queryClient.invalidateQueries({ queryKey: ['lab-dashboard'] })`
   - Triggered after successful report upload
   - Refreshes all dashboard-related data

2. **On 401 Error**: Auth store cleared, forces re-login

### Manual Invalidation
Users can manually refresh by:
- Navigating away and back (if beyond staleTime)
- Reloading the page

## Performance Benefits

1. **Reduced API Calls**:
   - Dashboard, patients, and tests views share the same cache
   - Only one API call needed for all three views

2. **Instant Navigation**:
   - Switching between views is instant (no loading states)
   - Data persists for 10 minutes after last use

3. **Optimistic Updates**:
   - Cache invalidation ensures fresh data after mutations
   - Background refetch keeps UI responsive

4. **Network Resilience**:
   - Retry logic handles temporary network issues
   - Reconnection triggers automatic data refresh

## Backend Route Mapping

### Authentication
- **POST /lab-login**: Lab technician login
  - Returns `session_token` and `lab_contact` info
  - Token stored in Zustand persist store

### Data Fetching
- **GET /lab-dashboard/{phone}**: Main dashboard data
  - Returns: lab_contact, lab_requests, stats, weekly_stats
  - Cached for 5 minutes

### Mutations
- **POST /api/lab-upload-reports**: Upload lab reports
  - Multipart form-data with `upload_token` and `files`
  - Invalidates lab-dashboard cache on success

### Doctor Routes (Future)
- **POST /lab-contacts**: Create lab contact
- **GET /lab-contacts**: List lab contacts
- **PUT /lab-contacts/{contact_id}**: Update lab contact
- **DELETE /lab-contacts/{contact_id}**: Delete lab contact
- **POST /visits/{visit_id}/request-lab-report**: Request lab report
- **POST /visits/{visit_id}/auto-create-lab-requests**: Auto-create requests

## Cache Keys Reference

| Query | Cache Key | Shared With | Invalidated By |
|-------|-----------|-------------|----------------|
| Dashboard | `['lab-dashboard', phone]` | Tests, Patients | Upload success |
| Tests | `['lab-dashboard', phone]` | Dashboard, Patients | Upload success |
| Patients | `['lab-dashboard', phone]` | Dashboard, Tests | Upload success |

## Best Practices

1. **Don't disable caching globally** - Use query-specific overrides
2. **Use `invalidateQueries`** after mutations that change server state
3. **Share cache keys** for related data (like dashboard/tests/patients)
4. **Set appropriate staleTime** based on data volatility
5. **Use `enabled` option** to prevent unnecessary requests

## Monitoring Cache Performance

To debug cache behavior in development:
1. Install React Query Devtools: `npm install @tanstack/react-query-devtools`
2. Add to providers:
   ```tsx
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
   
   <ReactQueryDevtools initialIsOpen={false} />
   ```

## Environment Configuration

Set your backend URL in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Default: `http://localhost:5000/api`
