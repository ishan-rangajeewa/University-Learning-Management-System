import { useParams } from 'react-router-dom'
import { useGetAssignmentByIdQuery } from './assignmentsApi'
import AssignmentForm from './AssignmentForm'

function AssignmentEditPage() {
  const { id } = useParams()
  const { data: assignment, isLoading, isError } = useGetAssignmentByIdQuery(id)

  if (isLoading) return <p className="text-gray-500">Loading assignment...</p>
  if (isError || !assignment) return <p className="text-red-600">Assignment not found.</p>

  return <AssignmentForm courseId={assignment.courseId} assignment={assignment} />
}

export default AssignmentEditPage