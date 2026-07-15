import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetCoursesQuery, useGetMyCoursesQuery } from './coursesApi'

function DashboardPage() {
  const user = useSelector(selectCurrentUser)
  const isLecturer = user?.role === 'ROLE_LECTURER'

  const allCoursesResult = useGetCoursesQuery(undefined, { skip: isLecturer })
  const myCoursesResult = useGetMyCoursesQuery(undefined, { skip: !isLecturer })

  const { data: courses, isLoading, isError } = isLecturer ? myCoursesResult : allCoursesResult

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        Welcome, {user?.firstname}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {isLecturer ? 'Here is an overview of the courses you teach.' : 'Here is an overview of your courses.'}
      </p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {isLecturer ? 'My Courses' : 'Enrolled / Available Courses'}
        </h2>
        <Link to="/courses" className="text-sm text-blue-600 hover:underline">
          View all courses
        </Link>
      </div>

      {isLoading && <p className="text-gray-500">Loading courses...</p>}
      {isError && <p className="text-red-600">Failed to load courses.</p>}
      {courses && courses.length === 0 && (
        <p className="text-gray-500">No courses to show yet.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.slice(0, 6).map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-medium text-blue-600">{course.courseCode}</p>
            <h3 className="text-lg font-semibold text-gray-800 mt-1">{course.title}</h3>
            {course.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
            )}
          </Link>
        ))}
      </div>

      {isLecturer && (
        <div className="mt-6">
          <Link
            to="/courses/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Course
          </Link>
        </div>
      )}
    </div>
  )
}

export default DashboardPage