import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetAssignmentByIdQuery, useDeleteAssignmentMutation } from './assignmentsApi'
import StudentSubmissionPanel from '../submissions/StudentSubmissionPanel'
import SubmissionsList from '../submissions/SubmissionsList'

function AssignmentDetailPage() {
  const { id } = useParams()
  const user = useSelector(selectCurrentUser)
  const isLecturer = user?.role === 'ROLE_LECTURER'
  const navigate = useNavigate()

  const { data: assignment, isLoading, isError } = useGetAssignmentByIdQuery(id)
  const [deleteAssignment] = useDeleteAssignmentMutation()

  if (isLoading) return <p className="text-gray-500">Loading assignment...</p>
  if (isError || !assignment) return <p className="text-red-600">Assignment not found.</p>

  const handleDelete = async () => {
    if (window.confirm('Delete this assignment? This cannot be undone.')) {
      try {
        await deleteAssignment({ id: assignment.id, courseId: assignment.courseId }).unwrap()
        navigate(`/courses/${assignment.courseId}`)
      } catch (err) {
        alert(err?.data?.message || 'Failed to delete assignment.')
      }
    }
  }

  return (
    <div>
      <Link to={`/courses/${assignment.courseId}`} className="text-sm text-blue-600 hover:underline">
        &larr; Back to course
      </Link>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{assignment.title}</h1>
          {assignment.description && <p className="text-gray-600 mt-2">{assignment.description}</p>}
          <p className="text-sm text-gray-400 mt-3">
            Due {new Date(assignment.dueDate).toLocaleString()} · {assignment.maxMarks} marks
          </p>
        </div>

        {isLecturer && (
          <div className="flex gap-3 shrink-0 ml-4">
            <Link
              to={`/assignments/${assignment.id}/edit`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </Link>
            <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>

      {isLecturer ? (
        <SubmissionsList assignmentId={assignment.id} maxMarks={assignment.maxMarks} />
      ) : (
        <StudentSubmissionPanel assignmentId={assignment.id} maxMarks={assignment.maxMarks} />
      )}
    </div>
  )
}

export default AssignmentDetailPage