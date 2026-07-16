import { useState } from 'react'
import {useCreateAdminMutation} from './adminApi'

function PendingLecturersPage() {
    const [formData, setFormData] = useState({ username: '', firstname:'', lastname:'', email: '', password: '', role: 'ROLE_LECTURER' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const[createLecture, {isLoading}] = useCreateAdminMutation();
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    try {
      await createLecture(formData).unwrap()
      setSuccess(true)
      setFormData({username: '', firstname:'', lastname:'', email: '', password: '', role: 'ROLE_LECTURER' })
    } catch (err) {
      setError(err?.data?.message || 'Failed to create admin account.')
    }
  }
    

  return (
    <>
      <div className="max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Lecturer Account</h1>

      {success && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          Admin account created successfully.
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg border border-gray-200'>
        <label className='block mb-4'>
          <span className="text-sm font-medium text-gray-700">First Name</span>
          <input 
          type="text"
          name='firstname'
          value={formData.firstname}
          onChange={handleChange}
          required
          className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </label>
        <label className='block mb-4'>
          <span className="text-sm font-medium text-gray-700">Last Name</span>
          <input 
          type="text"
          name='lastname'
          value={formData.lastname}
          onChange={handleChange}
          required
          className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </label>

        <label className='block mb-4'>
          <span className="text-sm font-medium text-gray-700">User Name</span>
          <input 
          type="text"
          name='username'
          value={formData.username}
          onChange={handleChange}
          required
          className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </label>

        <label className='block mb-4'>
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input 
          type="email"
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </label>
        <label className='block mb-4'>
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input 
          type="password"
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
          className='mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </label>
        <button
        type='submit'
        disabled = {isLoading}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating Lecturer..": "Create Lecturer"}
        </button>
      </form>
      </div>
    </>
  )
}

export default PendingLecturersPage