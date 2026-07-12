import { apiSlice } from '../../services/apiSlice'

export const materialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: (courseId) => `/courses/${courseId}/materials`,
      providesTags: (result, error, courseId) => [{ type: 'Material', id: `COURSE-${courseId}` }],
    }),

    uploadMaterial: builder.mutation({
      query: ({ courseId, title, file }) => {
        // FormData, not JSON - fetchBaseQuery leaves the Content-Type header
        // alone for FormData bodies, letting the browser set the multipart
        // boundary itself.
        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        return {
          url: `/courses/${courseId}/materials`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Material', id: `COURSE-${courseId}` }],
    }),

    // A lazy query, not a mutation - downloading doesn't change server state,
    // but we still need to trigger it imperatively (on button click) rather
    // than automatically on render, hence "lazy".
    downloadMaterial: builder.query({
      query: (materialId) => ({
        url: `/materials/${materialId}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteMaterial: builder.mutation({
      query: ({ materialId }) => ({
        url: `/materials/${materialId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Material', id: `COURSE-${courseId}` }],
    }),
  }),
})

export const {
  useGetMaterialsQuery,
  useUploadMaterialMutation,
  useLazyDownloadMaterialQuery,
  useDeleteMaterialMutation,
} = materialsApi