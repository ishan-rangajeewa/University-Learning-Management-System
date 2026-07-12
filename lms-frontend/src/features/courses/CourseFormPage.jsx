import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCourseMutation } from './coursesApi'

function CourseFormPage() {
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    description: '',
  })
  const [error, setError] = useState('')

  const [createCourse, { isLoading }] = useCreateCourseMutation()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const course = await createCourse(formData).unwrap()
      navigate(`/courses/${course.id}`)
    } catch (err) {
      setError(err?.data?.message || 'Failed to create course.')
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Course</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Course Code</span>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            maxLength={20}
            placeholder="e.g. CS3021"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="text-gray-600 font-medium px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseFormPage