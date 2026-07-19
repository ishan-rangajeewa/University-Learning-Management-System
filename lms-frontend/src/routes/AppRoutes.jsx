import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
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
import ManageEnrollmentPage from '../features/enrollments/ManageEnrollmentPage'
import ChangePasswordPage from '../features/auth/ChangePasswordPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'  

// import Home from '../'

function AppRoutes() {
  return (
    <Routes>
      {/* <Route path='/enrollments/manage' element={<ManageEnrollmentPage />}/> */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_LECTURER']} />}>
            <Route path="/enrollments/manage" element={<ManageEnrollmentPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
          <Route path="/change-password" element={<ChangePasswordPage/>}/>


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
            {/* <Route path="/admin/pending-lecturers" element={<PendingLecturersPage />} /> */}
            <Route path="/admin/create-admin" element={<CreateAdminPage />} />
            <Route path="/register-lecturer" element={<RegisterLecturerPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes