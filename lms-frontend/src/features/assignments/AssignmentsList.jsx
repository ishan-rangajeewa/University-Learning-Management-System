import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetAssignmentsQuery } from './assignmentsApi'

function AssignmentsList({ courseId }) {
  const user = useSelector(selectCurrentUser)
  const isLecturer = user?.role === 'ROLE_LECTURER'

  const { data: assignments, isLoading, isError } = useGetAssignmentsQuery(courseId)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Assignments</h2>
        {isLecturer && (
          <Link
            to={`/courses/${courseId}/assignments/new`}
            className="text-sm text-blue-600 hover:underline"
          >
            + New Assignment
          </Link>
        )}
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading assignments...</p>}
      {isError && <p className="text-red-600 text-sm">Failed to load assignments.</p>}
      {assignments && assignments.length === 0 && (
        <p className="text-gray-500 text-sm">No assignments posted yet.</p>
      )}

      <ul className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
        {assignments?.map((assignment) => (
          <li key={assignment.id}>
            <Link
              to={`/assignments/${assignment.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{assignment.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Due {new Date(assignment.dueDate).toLocaleString()} · {assignment.maxMarks} marks
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AssignmentsList