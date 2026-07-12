import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated } from '../../features/auth/authSlice'

/**
 * Usage in routes:
 *   <Route element={<ProtectedRoute />}>          -> any logged-in user
 *   <Route element={<ProtectedRoute allowedRoles={['ROLE_LECTURER']} />}>
 */
function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute