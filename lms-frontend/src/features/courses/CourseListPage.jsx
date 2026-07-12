import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetCoursesQuery, useGetMyCoursesQuery } from './coursesApi'

function CourseListPage() {
  const user = useSelector(selectCurrentUser)
  const isLecturer = user?.role === 'ROLE_LECTURER'

  // Lecturers see only the courses they own; students browse all courses.
  const allCoursesResult = useGetCoursesQuery(undefined, { skip: isLecturer })
  const myCoursesResult = useGetMyCoursesQuery(undefined, { skip: !isLecturer })

  const { data: courses, isLoading, isError } = isLecturer ? myCoursesResult : allCoursesResult

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isLecturer ? 'My Courses' : 'Available Courses'}
        </h1>

        {isLecturer && (
          <Link
            to="/courses/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Course
          </Link>
        )}
      </div>

      {isLoading && <p className="text-gray-500">Loading courses...</p>}
      {isError && <p className="text-red-600">Failed to load courses.</p>}

      {courses && courses.length === 0 && (
        <p className="text-gray-500">No courses to show yet.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-medium text-blue-600">{course.courseCode}</p>
            <h2 className="text-lg font-semibold text-gray-800 mt-1">{course.title}</h2>
            {course.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
            )}
            {course.lecturerUsername && (
              <p className="text-xs text-gray-400 mt-3">Lecturer: {course.lecturerUsername}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CourseListPage