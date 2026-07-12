import { useState } from 'react'
import { useUploadMaterialMutation } from './materialsApi'

function MaterialUploadForm({ courseId }) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const [uploadMaterial, { isLoading }] = useUploadMaterialMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please choose a file to upload.')
      return
    }

    try {
      await uploadMaterial({ courseId, title, file }).unwrap()
      setTitle('')
      setFile(null)
      e.target.reset()
    } catch (err) {
      setError(err?.data?.message || 'Failed to upload material.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
      {error && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Material title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  )
}

export default MaterialUploadForm