import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../auth/authSlice'

function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // If already logged in, skip the landing page and go straight to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-800">LMS</span>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-24 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Learning, organized in one place.
          </h1>
          <p className="mt-5 text-lg text-gray-500">
            Manage courses, enrollments, assignments, and grading — for
            admins, lecturers, and students alike.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Hero image - replace src below with your own image in /public */}
        <div className="w-full">
          <img
            src="/landing-hero.png"
            alt="Students and lecturers using the LMS"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </main>

      {/* Feature highlights */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-20 grid gap-6 sm:grid-cols-3">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800">Course Management</h3>
          <p className="mt-2 text-sm text-gray-500">
            Lecturers create and manage courses, materials, and assignments.
          </p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800">Enrollment</h3>
          <p className="mt-2 text-sm text-gray-500">
            Students enroll themselves, or admins and lecturers manage enrollment directly.
          </p>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800">Grading</h3>
          <p className="mt-2 text-sm text-gray-500">
            Submit assignments with file uploads and get graded feedback.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage