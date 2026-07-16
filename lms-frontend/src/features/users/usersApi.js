import { apiSlice } from '../../services/apiSlice'

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/users/students',
      providesTags: [{ type: 'User', id: 'STUDENT-LIST' }],
    }),
  }),
})

export const { useGetStudentsQuery } = usersApi