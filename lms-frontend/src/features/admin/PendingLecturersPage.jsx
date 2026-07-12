import { useState } from 'react'
import {
  useGetPendingLecturersQuery,
  useApproveLecturerMutation,
  useRejectLecturerMutation,
} from './adminApi'

function PendingLecturersPage() {
  const { data: lecturers, isLoading, isError } = useGetPendingLecturersQuery()
  const [approveLecturer] = useApproveLecturerMutation()
  const [rejectLecturer] = useRejectLecturerMutation()
  const [actioningId, setActioningId] = useState(null)
  const [error, setError] = useState('')

  const handleApprove = async (id) => {
    setError('')
    setActioningId(id)
    try {
      await approveLecturer(id).unwrap()
    } catch (err) {
      setError(err?.data?.message || 'Failed to approve lecturer.')
    } finally {
      setActioningId(null)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Reject and remove this lecturer application?')) return
    setError('')
    setActioningId(id)
    try {
      await rejectLecturer(id).unwrap()
    } catch (err) {
      setError(err?.data?.message || 'Failed to reject lecturer.')
    } finally {
      setActioningId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Pending Lecturer Approvals</h1>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {isError && <p className="text-red-600">Failed to load pending lecturers.</p>}
      {lecturers && lecturers.length === 0 && (
        <p className="text-gray-500">No pending lecturer applications.</p>
      )}

      <div className="space-y-3">
        {lecturers?.map((lecturer) => (
          <div
            key={lecturer.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">{lecturer.username}</p>
              <p className="text-sm text-gray-500">{lecturer.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(lecturer.id)}
                disabled={actioningId === lecturer.id}
                className="bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(lecturer.id)}
                disabled={actioningId === lecturer.id}
                className="bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingLecturersPage