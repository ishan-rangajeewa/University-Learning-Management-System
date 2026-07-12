// AssignmentService.java
package com.lms.backend.application.service;

import com.lms.backend.application.dto.request.AssignmentRequest;
import com.lms.backend.application.dto.response.AssignmentResponse;
import com.lms.backend.domain.model.Assignment;
import com.lms.backend.domain.model.Course;
import com.lms.backend.infrastructure.exception.ResourceNotFoundException;
import com.lms.backend.infrastructure.persistence.AssignmentRepository;
import com.lms.backend.infrastructure.persistence.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public AssignmentResponse createAssignment(String courseId, AssignmentRequest request, String lecturerId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", courseId));

        if (course.getLecturer() == null || !course.getLecturer().getId().equals(lecturerId)) {
            throw new AccessDeniedException("Only the owning lecturer can create assignments for this course");
        }

        Assignment assignment = Assignment.builder()
                .title(request.title())
                .description(request.description())
                .maxMarks(request.maxMarks())
                .dueDate(request.dueDate())
                .course(course)
                .build();

        return AssignmentResponse.from(assignmentRepository.save(assignment));
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> listAssignments(String courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(AssignmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(String id) {
        return AssignmentResponse.from(getAssignmentEntity(id));
    }

    @Transactional(readOnly = true)
    public Assignment getAssignmentEntity(String id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Assignment", id));
    }

    @Transactional
    public AssignmentResponse updateAssignment(String id, AssignmentRequest request, String lecturerId) {
        Assignment assignment = getAssignmentEntity(id);

        if (assignment.getCourse().getLecturer() == null
                || !assignment.getCourse().getLecturer().getId().equals(lecturerId)) {
            throw new AccessDeniedException("Only the owning lecturer can update this assignment");
        }

        assignment.setTitle(request.title());
        assignment.setDescription(request.description());
        assignment.setMaxMarks(request.maxMarks());
        assignment.setDueDate(request.dueDate());

        return AssignmentResponse.from(assignmentRepository.save(assignment));
    }

    @Transactional
    public void deleteAssignment(String id, String lecturerId) {
        Assignment assignment = getAssignmentEntity(id);

        if (assignment.getCourse().getLecturer() == null
                || !assignment.getCourse().getLecturer().getId().equals(lecturerId)) {
            throw new AccessDeniedException("Only the owning lecturer can delete this assignment");
        }

        assignmentRepository.delete(assignment);
    }
}