import { apiSlice } from '../../services/apiSlice'

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingLecturers: builder.query({
      query: () => '/admin/lecturers/pending',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PendingLecturer', id })),
              { type: 'PendingLecturer', id: 'LIST' },
            ]
          : [{ type: 'PendingLecturer', id: 'LIST' }],
    }),

    approveLecturer: builder.mutation({
      query: (id) => ({
        url: `/admin/lecturers/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'PendingLecturer', id: 'LIST' }],
    }),

    rejectLecturer: builder.mutation({
      query: (id) => ({
        url: `/admin/lecturers/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'PendingLecturer', id: 'LIST' }],
    }),

    createAdmin: builder.mutation({
      query: (adminData) => ({
        url: '/admin/admins',
        method: 'POST',
        body: adminData, // { username, email, password }
      }),
    }),
  }),
})

export const {
  useGetPendingLecturersQuery,
  useApproveLecturerMutation,
  useRejectLecturerMutation,
  useCreateAdminMutation,
} = adminApi