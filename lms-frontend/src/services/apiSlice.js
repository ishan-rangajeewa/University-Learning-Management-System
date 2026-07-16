import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Every feature's API (authApi, coursesApi, ...) injects endpoints into this
// single base API. This is the RTK Query recommended pattern - one base
// query config, one cache, endpoints spread across feature files.
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Course', 'Enrollment', 'Material', 'Assignment', 'Submission', 'PendingLecturer','User','Student'],
  endpoints: () => ({}),
})