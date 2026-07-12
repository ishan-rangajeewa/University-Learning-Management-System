import { useState } from 'react'
import { useGetSubmissionsByAssignmentQuery, useLazyDownloadSubmissionQuery } from './submissionsApi'
import GradeForm from './GradeForm'

function SubmissionsList({ assignmentId, maxMarks }) {
  const { data: submissions, isLoading, isError } = useGetSubmissionsByAssignmentQuery(assignmentId)
  const [triggerDownload] = useLazyDownloadSubmissionQuery()
  const [gradingId, setGradingId] = useState(null)

  const handleDownload = async (submission) => {
    const blob = await triggerDownload(submission.id).unwrap()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = submission.originalFilename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Submissions</h2>

      {isLoading && <p className="text-gray-500 text-sm">Loading submissions...</p>}
      {isError && <p className="text-red-600 text-sm">Failed to load submissions.</p>}
      {submissions && submissions.length === 0 && (
        <p className="text-gray-500 text-sm">No submissions yet.</p>
      )}

      <ul className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
        {submissions?.map((submission) => (
          <li key={submission.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{submission.studentUsername}</p>
                <p className="text-xs text-gray-400">
                  {new Date(submission.submittedAt).toLocaleString()} &middot;{' '}
                  <button
                    onClick={() => handleDownload(submission)}
                    className="text-blue-600 hover:underline"
                  >
                    {submission.originalFilename}
                  </button>
                </p>
              </div>

              <div className="text-right">
                {submission.marks != null ? (
                  <p className="text-sm font-medium text-green-700">
                    {submission.marks} / {maxMarks}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Not graded</p>
                )}
                <button
                  onClick={() => setGradingId(gradingId === submission.id ? null : submission.id)}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  {submission.marks != null ? 'Edit Grade' : 'Grade'}
                </button>
              </div>
            </div>

            {gradingId === submission.id && (
              <GradeForm
                submission={submission}
                assignmentId={assignmentId}
                maxMarks={maxMarks}
                onDone={() => setGradingId(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SubmissionsList