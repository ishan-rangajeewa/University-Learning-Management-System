import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800">403</h1>
      <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
      <Link to="/dashboard" className="mt-4 text-blue-600 hover:underline">
        Back to dashboard
      </Link>
    </div>
  )
}

export default UnauthorizedPage