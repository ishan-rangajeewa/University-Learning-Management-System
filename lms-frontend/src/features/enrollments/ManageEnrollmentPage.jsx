import { useState, useMemo } from 'react'
import { useGetCoursesQuery } from '../courses/coursesApi'
import { useGetStudentsQuery } from '../admin/studentsApi'
import { useGetCourseEnrollmentsQuery, useBulkEnrollMutation, useAdminUnenrollMutation } from './enrollmentsApi'
import Navbar from '../../components/layout/Navbar'

function ManageEnrollmentPage() {
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedStudentIds, setSelectedStudentIds] = useState([])
  const [studentToAdd, setStudentToAdd] = useState('')

  const { data: courses, isLoading: loadingCourses } = useGetCoursesQuery()
  const { data: students, isLoading: loadingStudents } = useGetStudentsQuery()
  const { data: courseEnrollments } = useGetCourseEnrollmentsQuery(selectedCourseId, {
    skip: !selectedCourseId,
  })

  const [bulkEnroll, { isLoading: isEnrolling }] = useBulkEnrollMutation()
  const [adminUnenroll, { isLoading: isUnenrolling }] = useAdminUnenrollMutation()

  // students already enrolled in the selected course (so we don't offer them again)
  const alreadyEnrolledIds = useMemo(
    () => new Set(courseEnrollments?.map((e) => e.studentId) ?? []),
    [courseEnrollments]
  )

  // right-side dropdown options: exclude already-picked students AND already-enrolled students
  const availableStudents = useMemo(
    () =>
      (students ?? []).filter(
        (s) => !selectedStudentIds.includes(s.id) && !alreadyEnrolledIds.has(s.id)
      ),
    [students, selectedStudentIds, alreadyEnrolledIds]
  )

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value)
    setSelectedStudentIds([]) // reset picks when course changes
    setStudentToAdd('')
  }

  const handleAddStudent = (e) => {
    const id = e.target.value
    if (!id) return
    // guard against duplicates (dropdown already excludes picked ones, this is a safety net)
    setSelectedStudentIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setStudentToAdd('')
  }

  const handleRemoveStudent = (id) => {
    setSelectedStudentIds((prev) => prev.filter((sid) => sid !== id))
  }

  const handleEnroll = async () => {
    if (!selectedCourseId || selectedStudentIds.length === 0) return
    await bulkEnroll({ courseId: selectedCourseId, studentIds: selectedStudentIds })
    setSelectedStudentIds([])
  }

  const handleUnenroll = async (studentId) => {
    await adminUnenroll({ courseId: selectedCourseId, studentId })
  }

  const selectedStudentObjs = (students ?? []).filter((s) => selectedStudentIds.includes(s.id))

  return (
    <div>
      <Navbar/>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Enrollment</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* LEFT: course single-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            disabled={loadingCourses}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">-- Select a course --</option>
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT: student multi-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
          <select
            value={studentToAdd}
            onChange={handleAddStudent}
            disabled={!selectedCourseId || loadingStudents}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">-- Select a student to add --</option>
            {availableStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.username})
              </option>
            ))}
          </select>

          {/* chips of currently selected students */}
          {selectedStudentObjs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedStudentObjs.map((s) => (
                <span
                  key={s.id}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                >
                  {s.firstName} {s.lastName}
                  <button
                    onClick={() => handleRemoveStudent(s.id)}
                    className="text-blue-500 hover:text-blue-800"
                    aria-label={`Remove ${s.username}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleEnroll}
        disabled={!selectedCourseId || selectedStudentIds.length === 0 || isEnrolling}
        className="mt-6 text-sm font-medium px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isEnrolling ? 'Enrolling...' : 'Enroll Selected Students'}
      </button>

      {/* currently enrolled list, with per-student unenroll */}
      {selectedCourseId && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Currently Enrolled</h2>
          {courseEnrollments && courseEnrollments.length === 0 && (
            <p className="text-gray-500 text-sm">No students enrolled yet.</p>
          )}
          <ul className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
            {courseEnrollments?.map((enrollment) => (
              <li
                key={enrollment.id}
                className="px-4 py-2 text-sm text-gray-700 flex items-center justify-between"
              >
                {enrollment.studentUsername}
                <button
                  onClick={() => handleUnenroll(enrollment.studentId)}
                  disabled={isUnenrolling}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Unenroll
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ManageEnrollmentPage