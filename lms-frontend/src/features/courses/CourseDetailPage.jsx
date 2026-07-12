import { useParams, Link } from 'react-router-dom'
import { useGetCourseByIdQuery } from './coursesApi'
import EnrollButton from '../enrollments/EnrollButton'
import EnrolledStudentsList from '../enrollments/EnrolledStudentsList'
import MaterialsList from '../materials/MaterialsList'
import AssignmentsList from '../assignments/AssignmentsList'

function CourseDetailPage() {
  const { id } = useParams()
  const { data: course, isLoading, isError } = useGetCourseByIdQuery(id)

  if (isLoading) return <p className="text-gray-500">Loading course...</p>
  if (isError || !course) return <p className="text-red-600">Course not found.</p>

  return (
    <div>
      <Link to="/courses" className="text-sm text-blue-600 hover:underline">
        &larr; Back to courses
      </Link>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">{course.courseCode}</p>
          <h1 className="text-2xl font-semibold text-gray-800 mt-1">{course.title}</h1>
          {course.description && <p className="text-gray-600 mt-2">{course.description}</p>}
          {course.lecturerUsername && (
            <p className="text-sm text-gray-400 mt-3">Lecturer: {course.lecturerUsername}</p>
          )}
        </div>

        <EnrollButton courseId={course.id} />
      </div>

      <EnrolledStudentsList courseId={course.id} />

      <MaterialsList courseId={course.id} />

      <AssignmentsList courseId={course.id} />

      {/* Rendered below once submissions feature is added */}
    </div>
  )
}

export default CourseDetailPage