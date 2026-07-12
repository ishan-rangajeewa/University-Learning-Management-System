import { useParams } from 'react-router-dom'
import AssignmentForm from './AssignmentForm'

function AssignmentCreatePage() {
  const { courseId } = useParams()
  return <AssignmentForm courseId={courseId} />
}

export default AssignmentCreatePage