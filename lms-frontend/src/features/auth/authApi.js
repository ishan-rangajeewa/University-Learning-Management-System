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
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body, // { email }
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body, // { email, otp, newPassword }
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi