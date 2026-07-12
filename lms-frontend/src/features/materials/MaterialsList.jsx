import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetMaterialsQuery, useLazyDownloadMaterialQuery, useDeleteMaterialMutation } from './materialsApi'
import MaterialUploadForm from './MaterialUploadForm'

function MaterialsList({ courseId }) {
  const user = useSelector(selectCurrentUser)
  const isLecturer = user?.role === 'ROLE_LECTURER'

  const { data: materials, isLoading, isError } = useGetMaterialsQuery(courseId)
  const [triggerDownload] = useLazyDownloadMaterialQuery()
  const [deleteMaterial] = useDeleteMaterialMutation()

  const handleDownload = async (material) => {
    const blob = await triggerDownload(material.id).unwrap()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = material.originalFilename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDelete = (materialId) => {
    if (window.confirm('Delete this material?')) {
      deleteMaterial({ materialId, courseId })
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Materials</h2>

      {isLecturer && <div className="mb-4"><MaterialUploadForm courseId={courseId} /></div>}

      {isLoading && <p className="text-gray-500 text-sm">Loading materials...</p>}
      {isError && <p className="text-red-600 text-sm">Failed to load materials.</p>}
      {materials && materials.length === 0 && (
        <p className="text-gray-500 text-sm">No materials uploaded yet.</p>
      )}

      <ul className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
        {materials?.map((material) => (
          <li key={material.id} className="flex items-center justify-between px-4 py-2">
            <div>
              <p className="text-sm font-medium text-gray-800">{material.title}</p>
              <p className="text-xs text-gray-400">{material.originalFilename}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(material)}
                className="text-sm text-blue-600 hover:underline"
              >
                Download
              </button>
              {isLecturer && (
                <button
                  onClick={() => handleDelete(material.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MaterialsList