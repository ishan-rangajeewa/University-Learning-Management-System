// AssignmentResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.model.Assignment;
import java.time.LocalDateTime;

public record AssignmentResponse(
        String id,
        String title,
        String description,
        Integer maxMarks,
        LocalDateTime dueDate,
        String courseId
) {
    public static AssignmentResponse from(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getMaxMarks(),
                assignment.getDueDate(),
                assignment.getCourse().getId()
        );
    }
}