import { Link } from 'react-router-dom'
import { useGetMyEnrollmentsQuery } from './enrollmentsApi'

function MyEnrollmentsPage() {
  const { data: enrollments, isLoading, isError } = useGetMyEnrollmentsQuery()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Enrolled Courses</h1>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {isError && <p className="text-red-600">Failed to load your enrollments.</p>}
      {enrollments && enrollments.length === 0 && (
        <p className="text-gray-500">
          You're not enrolled in any courses yet.{' '}
          <Link to="/courses" className="text-blue-600 hover:underline">
            Browse courses
          </Link>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments?.map((enrollment) => (
          <Link
            key={enrollment.id}
            to={`/courses/${enrollment.courseId}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-800">{enrollment.courseTitle}</h2>
            <p className="text-xs text-gray-400 mt-2">
              Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MyEnrollmentsPage