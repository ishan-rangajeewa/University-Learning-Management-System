import { useState } from 'react'
import { useGradeSubmissionMutation } from './submissionsApi'

function GradeForm({ submission, assignmentId, maxMarks, onDone }) {
  const [marks, setMarks] = useState(submission.marks ?? '')
  const [feedback, setFeedback] = useState(submission.feedback ?? '')
  const [error, setError] = useState('')

  const [gradeSubmission, { isLoading }] = useGradeSubmissionMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await gradeSubmission({
        submissionId: submission.id,
        assignmentId,
        marks: Number(marks),
        feedback,
      }).unwrap()
      onDone()
    } catch (err) {
      setError(err?.data?.message || 'Failed to save grade.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-gray-50 border border-gray-200 rounded p-3">
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700">
          Marks
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
            min={0}
            max={maxMarks}
            className="ml-2 w-20 border border-gray-300 rounded px-2 py-1"
          />
          <span className="text-gray-400"> / {maxMarks}</span>
        </label>
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Feedback (optional)"
        rows={2}
        className="mt-2 w-full border border-gray-300 rounded px-2 py-1 text-sm"
      />

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Grade'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default GradeForm