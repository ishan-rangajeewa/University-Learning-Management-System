import { apiSlice } from '../../services/apiSlice'

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/users/students',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Student', id })),
              { type: 'Student', id: 'LIST' },
            ]
          : [{ type: 'Student', id: 'LIST' }],
    }),
  }),
})

export const { useGetStudentsQuery } = studentsApi