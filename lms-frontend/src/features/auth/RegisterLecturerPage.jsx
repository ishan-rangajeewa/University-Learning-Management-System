import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegisterMutation } from './authApi'

// Lecturer accounts are created disabled and require admin approval before
// they can log in, so we never auto-login here - just show a pending message.
function RegisterLecturerPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [register, { isLoading }] = useRegisterMutation()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await register({ ...formData, role: 'ROLE_LECTURER' }).unwrap()
      setSubmitted(true)
    } catch (err) {
      setError(err?.data?.message || 'Registration failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-xl font-semibold mb-3 text-gray-800">Application submitted</h1>
          <p className="text-sm text-gray-600 mb-6">
            Your lecturer account has been created and is pending admin approval.
            You'll be able to log in once an admin approves it.
          </p>
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            Back to log in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-1 text-gray-800">Apply as Lecturer</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your account will need admin approval before you can log in.
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Username</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit application'}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterLecturerPage