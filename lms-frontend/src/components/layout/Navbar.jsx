import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../../features/auth/authSlice'

function Navbar() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-lg font-semibold text-gray-800">
          LMS
        </Link>

        {user?.role === 'ROLE_ADMIN' && (
          <div className="flex items-center gap-4">
            <Link to="/admin/pending-lecturers" className="text-sm text-gray-600 hover:text-blue-600">
              Pending Lecturers
            </Link>
            <Link to="/admin/create-admin" className="text-sm text-gray-600 hover:text-blue-600">
              Create Admin
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.username} <span className="text-gray-400">({user?.role?.replace('ROLE_', '')})</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}

export default Navbar