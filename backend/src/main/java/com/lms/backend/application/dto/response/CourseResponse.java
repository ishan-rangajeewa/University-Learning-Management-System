// CourseResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.model.Course;
import java.time.LocalDateTime;

public record CourseResponse(
        String id,
        String courseCode,
        String title,
        String description,
        String lecturerId,
        String lecturerUsername,
        LocalDateTime createdAt
) {
    public static CourseResponse from(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getCourseCode(),
                course.getTitle(),
                course.getDescription(),
                course.getLecturer() != null ? course.getLecturer().getId() : null,
                course.getLecturer() != null ? course.getLecturer().getUsername() : null,
                course.getCreatedAt()
        );
    }
}