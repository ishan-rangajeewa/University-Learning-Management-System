import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useChangePasswordMutation } from './authApi'
import { logout } from './authSlice'
import { apiSlice } from '../../services/apiSlice'
import Navbar from '../../components/layout/Navbar'

function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [changePassword, { isLoading }] = useChangePasswordMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validate = () => {
        if (newPassword.length < 8) {
            return 'New password must be at least 8 characters'
        }
        if (newPassword !== confirmPassword) {
            return 'New password and confirmation do not match'
        }
        if (newPassword === currentPassword) {
            return 'New password must be different from the current password'
        }
        return ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            await changePassword({ currentPassword, newPassword }).unwrap()
            setSuccess(true)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            setError(err?.data?.message || 'Current password is incorrect')
        }
    }

    const handleLogoutAfterChange = () => {
        dispatch(logout())
        dispatch(apiSlice.util.resetApiState())
        navigate('/login')
    }

    return (
        <>
            <Navbar />
            <div className="max-w-sm">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
                    {error && (
                        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                            {error}
                        </p>
                    )}

                    {success && (
                        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                            Password changed successfully.{' '}
                            <button
                                type="button"
                                onClick={handleLogoutAfterChange}
                                className="underline font-medium"
                            >
                                Log in again
                            </button>
                        </div>
                    )}

                    <label className="block mb-4">
                        <span className="text-sm font-medium text-gray-700">Current password</span>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-sm font-medium text-gray-700">New password</span>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-400">At least 8 characters</span>
                    </label>

                    <label className="block mb-6">
                        <span className="text-sm font-medium text-gray-700">Re-enter new password</span>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default ChangePasswordPage