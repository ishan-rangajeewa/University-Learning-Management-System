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


    createAdmin: builder.mutation({
      query: (adminData) => ({
        url: '/auth/register',
        method: 'POST',
        body: adminData, // { username, email, password }
      }),
    }),
  }),
})

export const {
  useGetPendingLecturersQuery,
  useApproveLecturerMutation,
  useCreateAdminMutation,
} = adminApi