import { useState } from 'react'
import { useGetMySubmissionsQuery, useSubmitAssignmentMutation, useLazyDownloadSubmissionQuery } from './submissionsApi'

function StudentSubmissionPanel({ assignmentId, maxMarks }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const { data: mySubmissions, isLoading: isLoadingSubmissions } = useGetMySubmissionsQuery()
  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation()
  const [triggerDownload] = useLazyDownloadSubmissionQuery()

  const mySubmission = mySubmissions?.find((s) => s.assignmentId === assignmentId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please choose a file to submit.')
      return
    }

    try {
      await submitAssignment({ assignmentId, file }).unwrap()
      setFile(null)
      e.target.reset()
    } catch (err) {
      setError(err?.data?.message || 'Failed to submit assignment.')
    }
  }

  const handleDownload = async () => {
    const blob = await triggerDownload(mySubmission.id).unwrap()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = mySubmission.originalFilename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoadingSubmissions) return null

  if (mySubmission) {
    return (
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Submission</h2>
        <p className="text-sm text-gray-600">
          Submitted {new Date(mySubmission.submittedAt).toLocaleString()} &middot;{' '}
          <button onClick={handleDownload} className="text-blue-600 hover:underline">
            {mySubmission.originalFilename}
          </button>
        </p>

        {mySubmission.marks != null ? (
          <div className="mt-3 bg-green-50 border border-green-200 rounded px-3 py-2">
            <p className="text-sm font-medium text-green-800">
              Grade: {mySubmission.marks} / {maxMarks}
            </p>
            {mySubmission.feedback && (
              <p className="text-sm text-green-700 mt-1">{mySubmission.feedback}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Not graded yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Submit Your Work</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentSubmissionPanel