import { apiSlice } from '../../services/apiSlice'

export const submissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubmissionsByAssignment: builder.query({
      query: (assignmentId) => `/assignments/${assignmentId}/submissions`,
      providesTags: (result, error, assignmentId) => [{ type: 'Submission', id: `ASSIGNMENT-${assignmentId}` }],
    }),

    getMySubmissions: builder.query({
      query: () => '/submissions/my-submissions',
      providesTags: [{ type: 'Submission', id: 'MY-LIST' }],
    }),

    submitAssignment: builder.mutation({
      query: ({ assignmentId, file }) => {
        const formData = new FormData()
        formData.append('file', file)

        return {
          url: `/assignments/${assignmentId}/submissions`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { assignmentId }) => [
        { type: 'Submission', id: `ASSIGNMENT-${assignmentId}` },
        { type: 'Submission', id: 'MY-LIST' },
      ],
    }),

    downloadSubmission: builder.query({
      query: (submissionId) => ({
        url: `/submissions/${submissionId}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    gradeSubmission: builder.mutation({
      query: ({ submissionId, ...body }) => ({
        url: `/submissions/${submissionId}/grade`,
        method: 'PUT',
        body, // { marks, feedback }
      }),
      invalidatesTags: (result, error, { assignmentId }) => [
        { type: 'Submission', id: `ASSIGNMENT-${assignmentId}` },
      ],
    }),
  }),
})

export const {
  useGetSubmissionsByAssignmentQuery,
  useGetMySubmissionsQuery,
  useSubmitAssignmentMutation,
  useLazyDownloadSubmissionQuery,
  useGradeSubmissionMutation,
} = submissionsApi