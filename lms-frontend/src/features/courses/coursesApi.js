import { apiSlice } from '../../services/apiSlice'

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Course', id })),
              { type: 'Course', id: 'LIST' },
            ]
          : [{ type: 'Course', id: 'LIST' }],
    }),

    getMyCourses: builder.query({
      query: () => '/courses/my-courses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Course', id })),
              { type: 'Course', id: 'LIST' },
            ]
          : [{ type: 'Course', id: 'LIST' }],
    }),

    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),

    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/courses',
        method: 'POST',
        body: courseData, // { courseCode, title, description }
      }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...courseData }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: courseData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Course', id }],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetMyCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi