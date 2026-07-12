import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateAssignmentMutation, useUpdateAssignmentMutation } from './assignmentsApi'

// Converts a backend ISO datetime ("2026-07-20T10:00:00") to the format the
// <input type="datetime-local"> value prop needs ("2026-07-20T10:00").
function toDatetimeLocalValue(isoString) {
  if (!isoString) return ''
  return isoString.slice(0, 16)
}

function AssignmentForm({ courseId, assignment }) {
  const isEditMode = Boolean(assignment)

  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    maxMarks: assignment?.maxMarks || 100,
    dueDate: toDatetimeLocalValue(assignment?.dueDate),
  })
  const [error, setError] = useState('')

  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation()
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation()
  const isLoading = isCreating || isUpdating

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === 'maxMarks' ? Number(value) : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      ...formData,
      dueDate: `${formData.dueDate}:00`, // pad seconds back on for the backend
    }

    try {
      if (isEditMode) {
        await updateAssignment({ id: assignment.id, courseId, ...payload }).unwrap()
        navigate(`/assignments/${assignment.id}`)
      } else {
        const created = await createAssignment({ courseId, ...payload }).unwrap()
        navigate(`/assignments/${created.id}`)
      }
    } catch (err) {
      setError(err?.data?.message || 'Failed to save assignment.')
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Edit Assignment' : 'Create Assignment'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Max Marks</span>
          <input
            type="number"
            name="maxMarks"
            value={formData.maxMarks}
            onChange={handleChange}
            required
            min={1}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Due Date</span>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Assignment'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600 font-medium px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AssignmentForm