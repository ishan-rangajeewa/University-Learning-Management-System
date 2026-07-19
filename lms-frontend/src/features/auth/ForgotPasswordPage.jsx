import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForgotPasswordMutation, useResetPasswordMutation } from './authApi'

function ForgotPasswordPage() {
  const [step, setStep] = useState('email') 
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await forgotPassword({ email }).unwrap()
      setInfo('An OTP has been sent to your email.')
      setStep('reset')
    } catch (err) {
      setError(err?.data?.message || 'Could not find an account with that email')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }

    try {
      await resetPassword({ email, otp, newPassword }).unwrap()
      navigate('/login')
    } catch (err) {
      setError(err?.data?.message || 'Invalid or expired OTP')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-gray-200">
        <Link to="/" className="text-lg font-semibold text-gray-800">
          LMS
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Forgot Password</h1>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
          {info && !error && (
            <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
              {info}
            </p>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendOtp}>
              <label className="block mb-6">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword}>
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">OTP Code</span>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block mb-6">
                <span className="text-sm font-medium text-gray-700">Re-enter New Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="mt-4 text-sm text-center text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage