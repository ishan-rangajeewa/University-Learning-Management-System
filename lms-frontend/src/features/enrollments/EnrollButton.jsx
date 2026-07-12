import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetMyEnrollmentsQuery, useEnrollMutation, useUnenrollMutation } from './enrollmentsApi'

function EnrollButton({ courseId }) {
  const user = useSelector(selectCurrentUser)
  const { data: myEnrollments, isLoading: isLoadingEnrollments } = useGetMyEnrollmentsQuery(undefined, {
    skip: user?.role !== 'ROLE_STUDENT',
  })
  const [enroll, { isLoading: isEnrolling }] = useEnrollMutation()
  const [unenroll, { isLoading: isUnenrolling }] = useUnenrollMutation()

  if (user?.role !== 'ROLE_STUDENT') return null
  if (isLoadingEnrollments) return null

  const isEnrolled = myEnrollments?.some((e) => e.courseId === courseId)

  const handleClick = () => {
    if (isEnrolled) {
      unenroll(courseId)
    } else {
      enroll(courseId)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isEnrolling || isUnenrolling}
      className={
        isEnrolled
          ? 'text-sm font-medium px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50'
          : 'text-sm font-medium px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
      }
    >
      {isEnrolled ? (isUnenrolling ? 'Unenrolling...' : 'Unenroll') : isEnrolling ? 'Enrolling...' : 'Enroll'}
    </button>
  )
}

export default EnrollButton