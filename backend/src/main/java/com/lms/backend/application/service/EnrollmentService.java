// EnrollmentService.java
package com.lms.backend.application.service;

import com.lms.backend.application.dto.response.EnrollmentResponse;
import com.lms.backend.domain.model.Course;
import com.lms.backend.domain.model.Enrollment;
import com.lms.backend.domain.model.User;
import com.lms.backend.infrastructure.exception.DuplicateResourceException;
import com.lms.backend.infrastructure.exception.ResourceNotFoundException;
import com.lms.backend.infrastructure.persistence.CourseRepository;
import com.lms.backend.infrastructure.persistence.EnrollmentRepository;
import com.lms.backend.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public EnrollmentResponse enroll(String courseId, String studentId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new DuplicateResourceException("Already enrolled in this course");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", courseId));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", studentId));

        Enrollment enrollment = Enrollment.builder()
                .course(course)
                .student(student)
                .build();

        return EnrollmentResponse.from(enrollmentRepository.save(enrollment));
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyEnrollments(String studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(EnrollmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getCourseEnrollments(String courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(EnrollmentResponse::from)
                .toList();
    }

    @Transactional
    public void unenroll(String courseId, String studentId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for this course"));
        enrollmentRepository.delete(enrollment);
    }
}