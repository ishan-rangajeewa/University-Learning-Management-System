import { apiSlice } from '../../services/apiSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials, // { username, email, password, role }
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials, // { username, password }
      }),
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation } = authApi