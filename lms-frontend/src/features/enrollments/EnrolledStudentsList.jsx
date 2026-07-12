import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetCourseEnrollmentsQuery } from './enrollmentsApi'

function EnrolledStudentsList({ courseId }) {
  const user = useSelector(selectCurrentUser)
  const { data: enrollments, isLoading, isError } = useGetCourseEnrollmentsQuery(courseId, {
    skip: user?.role !== 'ROLE_LECTURER',
  })

  if (user?.role !== 'ROLE_LECTURER') return null

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Enrolled Students</h2>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
      {isError && <p className="text-red-600 text-sm">Failed to load enrollments.</p>}
      {enrollments && enrollments.length === 0 && (
        <p className="text-gray-500 text-sm">No students enrolled yet.</p>
      )}

      <ul className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
        {enrollments?.map((enrollment) => (
          <li key={enrollment.id} className="px-4 py-2 text-sm text-gray-700">
            {enrollment.studentUsername}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EnrolledStudentsList