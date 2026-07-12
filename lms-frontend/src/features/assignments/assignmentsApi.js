import { apiSlice } from '../../services/apiSlice'

export const assignmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: (courseId) => `/courses/${courseId}/assignments`,
      providesTags: (result, error, courseId) => [{ type: 'Assignment', id: `COURSE-${courseId}` }],
    }),

    getAssignmentById: builder.query({
      query: (id) => `/assignments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),

    createAssignment: builder.mutation({
      query: ({ courseId, ...body }) => ({
        url: `/courses/${courseId}/assignments`,
        method: 'POST',
        body, // { title, description, maxMarks, dueDate }
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Assignment', id: `COURSE-${courseId}` }],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, courseId, ...body }) => ({
        url: `/assignments/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id, courseId }) => [
        { type: 'Assignment', id },
        { type: 'Assignment', id: `COURSE-${courseId}` },
      ],
    }),

    deleteAssignment: builder.mutation({
      query: ({ id }) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, courseId }) => [
        { type: 'Assignment', id },
        { type: 'Assignment', id: `COURSE-${courseId}` },
      ],
    }),
  }),
})

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi