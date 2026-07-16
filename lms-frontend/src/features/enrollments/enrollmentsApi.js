import { apiSlice } from '../../services/apiSlice'

export const enrollmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query({
      query: () => '/enrollments/my-enrollments',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Enrollment', id })),
              { type: 'Enrollment', id: 'LIST' },
            ]
          : [{ type: 'Enrollment', id: 'LIST' }],
    }),

    getCourseEnrollments: builder.query({
      query: (courseId) => `/courses/${courseId}/enrollments`,
      providesTags: (result, error, courseId) => [{ type: 'Enrollment', id: `COURSE-${courseId}` }],
    }),

    enroll: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: 'Enrollment', id: 'LIST' },
        { type: 'Enrollment', id: `COURSE-${courseId}` },
      ],
    }),

    unenroll: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, courseId) => [
        { type: 'Enrollment', id: 'LIST' },
        { type: 'Enrollment', id: `COURSE-${courseId}` },
      ],
    }),

    bulkEnroll: builder.mutation({
      query: ({ courseId, studentIds }) => ({
        url: `/courses/${courseId}/enrollments`,
        method: 'POST',
        body: { studentIds },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Enrollment', id: 'LIST' },
        { type: 'Enrollment', id: `COURSE-${courseId}` },
      ],
    }),

    adminUnenroll: builder.mutation({
      query: ({ courseId, studentId }) => ({
        url: `/courses/${courseId}/enrollments/${studentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Enrollment', id: 'LIST' },
        { type: 'Enrollment', id: `COURSE-${courseId}` },
      ],
    }),
  }),
})

export const {
  useGetMyEnrollmentsQuery,
  useGetCourseEnrollmentsQuery,
  useEnrollMutation,
  useUnenrollMutation,
  useBulkEnrollMutation,
  useAdminUnenrollMutation,
} = enrollmentsApi