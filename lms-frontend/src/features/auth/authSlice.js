import { createSlice } from '@reduxjs/toolkit'

const storedToken = localStorage.getItem('token')
const storedUser = localStorage.getItem('user')

const initialState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null, 
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, userId, username, firstname, role } = action.payload
      state.token = token
      state.user = { userId, username, firstname, role }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')

    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)