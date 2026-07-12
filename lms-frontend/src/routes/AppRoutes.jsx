import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardLayout from '../components/layout/DashboardLayout'
import UnauthorizedPage from '../components/common/UnauthorizedPage'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import RegisterLecturerPage from '../features/auth/RegisterLecturerPage'
import DashboardPage from '../features/courses/DashboardPage'
import CourseListPage from '../features/courses/CourseListPage'
import CourseFormPage from '../features/courses/CourseFormPage'
import CourseDetailPage from '../features/courses/CourseDetailPage'
import MyEnrollmentsPage from '../features/enrollments/MyEnrollmentsPage'
import AssignmentDetailPage from '../features/assignments/AssignmentDetailPage'
import AssignmentCreatePage from '../features/assignments/AssignmentCreatePage'
import AssignmentEditPage from '../features/assignments/AssignmentEditPage'
import PendingLecturersPage from '../features/admin/PendingLecturersPage'
import CreateAdminPage from '../features/admin/CreateAdminPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-lecturer" element={<RegisterLecturerPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/assignments/:id" element={<AssignmentDetailPage />} />

          {/* Student only */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
            <Route path="/my-enrollments" element={<MyEnrollmentsPage />} />
          </Route>

          {/* Lecturer only */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_LECTURER']} />}>
            <Route path="/courses/new" element={<CourseFormPage />} />
            <Route path="/courses/:courseId/assignments/new" element={<AssignmentCreatePage />} />
            <Route path="/assignments/:id/edit" element={<AssignmentEditPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/pending-lecturers" element={<PendingLecturersPage />} />
            <Route path="/admin/create-admin" element={<CreateAdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes