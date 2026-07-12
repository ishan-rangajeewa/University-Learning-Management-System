// EnrollmentResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.model.Enrollment;
import java.time.LocalDateTime;

public record EnrollmentResponse(
        String id,
        String studentId,
        String studentUsername,
        String courseId,
        String courseTitle,
        LocalDateTime enrolledAt
) {
    public static EnrollmentResponse from(Enrollment enrollment) {
        return new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getStudent().getId(),
                enrollment.getStudent().getUsername(),
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getEnrolledAt()
        );
    }
}