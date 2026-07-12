// CourseService.java
package com.lms.backend.application.service;

import com.lms.backend.application.dto.request.CourseRequest;
import com.lms.backend.application.dto.response.CourseResponse;
import com.lms.backend.domain.model.Course;
import com.lms.backend.domain.model.User;
import com.lms.backend.infrastructure.exception.DuplicateResourceException;
import com.lms.backend.infrastructure.exception.ResourceNotFoundException;
import com.lms.backend.infrastructure.persistence.CourseRepository;
import com.lms.backend.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public CourseResponse createCourse(CourseRequest request, String lecturerId) {
        if (courseRepository.existsByCourseCode(request.courseCode())) {
            throw new DuplicateResourceException("Course code already exists: " + request.courseCode());
        }

        User lecturer = userRepository.findById(lecturerId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", lecturerId));

        Course course = Course.builder()
                .courseCode(request.courseCode())
                .title(request.title())
                .description(request.description())
                .lecturer(lecturer)
                .build();

        return CourseResponse.from(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", id));
        return CourseResponse.from(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByLecturer(String lecturerId) {
        return courseRepository.findByLecturerId(lecturerId).stream()
                .map(CourseResponse::from)
                .toList();
    }

    @Transactional
    public CourseResponse updateCourse(String id, CourseRequest request, String lecturerId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", id));

        if (course.getLecturer() == null || !course.getLecturer().getId().equals(lecturerId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Only the owning lecturer can update this course");
        }

        course.setTitle(request.title());
        course.setDescription(request.description());
        return CourseResponse.from(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(String id, String lecturerId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", id));

        if (course.getLecturer() == null || !course.getLecturer().getId().equals(lecturerId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Only the owning lecturer can delete this course");
        }

        courseRepository.delete(course);
    }
}